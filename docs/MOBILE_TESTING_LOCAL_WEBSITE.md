# Mobile Testing Guide for Local Website

This guide explains how to view your local development version of the DateBack website on your mobile device (iPhone/Android).

## Prerequisites

1.  Your computer (Mac) and your phone must be connected to the **same Wi-Fi network**.
2.  You need to use Terminal on your Mac.

---

## Step 1: Open Terminal and Navigate to Folder

Open the **Terminal** app and navigate to the website directory:

```bash
cd /path/to/DateBack_Website
```

---

## Step 2: Find Your Mac's Local IP Address

Run this command in Terminal to see your local IP address:

```bash
ipconfig getifaddr en0
```

*   **Example Output:** `192.168.4.211`
*   *Write this number down.*

---

## Step 3: Start the Local Web Server

Run this command to start a simple Python web server on port 8000:

```bash
python3 -m http.server 8000
```

You should see output like:
`Serving HTTP on :: port 8000 (http://[::]:8000/) ...`

---

## Step 4: Open on Your Phone

1.  Open Chrome or Safari on your phone.
2.  Type the address using the IP you found in Step 2:

    **`http://<YOUR_IP_ADDRESS>:8000`**

    *   **Example:** `http://192.168.4.211:8000`

### ⚠️ Critical Note
**Do NOT use HTTPS.** Type `http://` explicitly. If your browser auto-corrects to `https://`, you will get a "Connection Failed" error.

---

## Step 5: Stop the Server

When you are done testing:
1.  Go back to your Terminal window.
2.  Press **Control + C** to stop the server.
