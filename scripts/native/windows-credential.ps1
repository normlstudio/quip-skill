param(
    [Parameter(Mandatory = $true)][ValidateSet('store', 'get', 'delete')][string]$Action,
    [Parameter(Mandatory = $true)][string]$Service,
    [Parameter(Mandatory = $true)][string]$Account
)

$ErrorActionPreference = 'Stop'
$Target = "$Service|$Account"

Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;

public static class QuipCredentialStore {
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    public struct CREDENTIAL {
        public UInt32 Flags;
        public UInt32 Type;
        public string TargetName;
        public string Comment;
        public System.Runtime.InteropServices.ComTypes.FILETIME LastWritten;
        public UInt32 CredentialBlobSize;
        public IntPtr CredentialBlob;
        public UInt32 Persist;
        public UInt32 AttributeCount;
        public IntPtr Attributes;
        public string TargetAlias;
        public string UserName;
    }

    [DllImport("advapi32", EntryPoint = "CredWriteW", CharSet = CharSet.Unicode, SetLastError = true)]
    public static extern bool CredWrite(ref CREDENTIAL credential, UInt32 flags);

    [DllImport("advapi32", EntryPoint = "CredReadW", CharSet = CharSet.Unicode, SetLastError = true)]
    public static extern bool CredRead(string target, UInt32 type, UInt32 flags, out IntPtr credential);

    [DllImport("advapi32", EntryPoint = "CredDeleteW", CharSet = CharSet.Unicode, SetLastError = true)]
    public static extern bool CredDelete(string target, UInt32 type, UInt32 flags);

    [DllImport("advapi32", SetLastError = true)]
    public static extern void CredFree(IntPtr buffer);
}
'@

try {
    if ($Action -eq 'store') {
        $Secret = [Console]::In.ReadToEnd()
        if ([string]::IsNullOrEmpty($Secret) -or [Text.Encoding]::Unicode.GetByteCount($Secret) -gt 2560) {
            throw 'invalid-input'
        }

        $Pointer = [Runtime.InteropServices.Marshal]::StringToCoTaskMemUni($Secret)
        try {
            $Credential = New-Object QuipCredentialStore+CREDENTIAL
            $Credential.Type = 1
            $Credential.TargetName = $Target
            $Credential.CredentialBlobSize = [Text.Encoding]::Unicode.GetByteCount($Secret)
            $Credential.CredentialBlob = $Pointer
            $Credential.Persist = 2
            $Credential.UserName = $Account
            if (-not [QuipCredentialStore]::CredWrite([ref]$Credential, 0)) {
                throw 'credential-write-failed'
            }
        } finally {
            [Runtime.InteropServices.Marshal]::ZeroFreeCoTaskMemUnicode($Pointer)
        }
        [Console]::Out.Write('stored')
    } elseif ($Action -eq 'get') {
        $Pointer = [IntPtr]::Zero
        if (-not [QuipCredentialStore]::CredRead($Target, 1, 0, [ref]$Pointer)) {
            throw 'credential-read-failed'
        }
        try {
            $Credential = [Runtime.InteropServices.Marshal]::PtrToStructure($Pointer, [type][QuipCredentialStore+CREDENTIAL])
            $Secret = [Runtime.InteropServices.Marshal]::PtrToStringUni($Credential.CredentialBlob, [int]($Credential.CredentialBlobSize / 2))
            [Console]::Out.Write($Secret)
        } finally {
            [QuipCredentialStore]::CredFree($Pointer)
        }
    } else {
        if (-not [QuipCredentialStore]::CredDelete($Target, 1, 0)) {
            $ErrorCode = [Runtime.InteropServices.Marshal]::GetLastWin32Error()
            if ($ErrorCode -ne 1168) {
                throw 'credential-delete-failed'
            }
        }
        [Console]::Out.Write('deleted')
    }
} catch {
    [Console]::Error.Write('credential-store-error')
    exit 1
}
