// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn download(fileloc: &str, contents: &str, homedir: &str) {
    let filepath_text = format!("/home/{}/Downloads/{}", homedir, fileloc).trim().to_string();
    println!("Downloading file to: {}", filepath_text);
    fs::write(filepath_text, contents).expect("Unable to write file");
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![download])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
