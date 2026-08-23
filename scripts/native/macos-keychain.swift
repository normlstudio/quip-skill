import Foundation
import Security

enum HelperError: Error {
    case invalidArguments
    case invalidInput
    case keychain(OSStatus)
}

func fail(_ error: Error) -> Never {
    if case HelperError.keychain(let status) = error {
        FileHandle.standardError.write(Data("credential-store-error:\(status)\n".utf8))
    } else {
        FileHandle.standardError.write(Data("credential-store-error\n".utf8))
    }
    exit(1)
}

guard CommandLine.arguments.count == 4 else {
    fail(HelperError.invalidArguments)
}

let action = CommandLine.arguments[1]
let service = CommandLine.arguments[2]
let account = CommandLine.arguments[3]

guard !service.isEmpty, !account.isEmpty, service.utf8.count <= 255, account.utf8.count <= 1024 else {
    fail(HelperError.invalidArguments)
}

let query: [String: Any] = [
    kSecClass as String: kSecClassGenericPassword,
    kSecAttrService as String: service,
    kSecAttrAccount as String: account,
]

switch action {
case "store":
    let secret = FileHandle.standardInput.readDataToEndOfFile()
    guard !secret.isEmpty, secret.count <= 16_384 else {
        fail(HelperError.invalidInput)
    }

    let update: [String: Any] = [
        kSecValueData as String: secret,
    ]
    var status = SecItemUpdate(query as CFDictionary, update as CFDictionary)

    if status == errSecItemNotFound {
        var add = query
        add[kSecValueData as String] = secret
        add[kSecAttrAccessible as String] = kSecAttrAccessibleWhenUnlockedThisDeviceOnly
        status = SecItemAdd(add as CFDictionary, nil)
    }

    guard status == errSecSuccess else {
        fail(HelperError.keychain(status))
    }
    FileHandle.standardOutput.write(Data("stored\n".utf8))

case "get":
    var lookup = query
    lookup[kSecReturnData as String] = true
    lookup[kSecMatchLimit as String] = kSecMatchLimitOne
    var result: CFTypeRef?
    let status = SecItemCopyMatching(lookup as CFDictionary, &result)
    guard status == errSecSuccess, let secret = result as? Data else {
        fail(HelperError.keychain(status))
    }
    FileHandle.standardOutput.write(secret)

case "delete":
    let status = SecItemDelete(query as CFDictionary)
    guard status == errSecSuccess || status == errSecItemNotFound else {
        fail(HelperError.keychain(status))
    }
    FileHandle.standardOutput.write(Data("deleted\n".utf8))

default:
    fail(HelperError.invalidArguments)
}
