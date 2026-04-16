//
//  MainViewController.swift
//  App
//
//  Created by test on 19/2/26.
//

import Foundation

import Capacitor

class MainViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(ImapPlugin())
    }
}
