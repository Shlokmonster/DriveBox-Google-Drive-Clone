let authToken = null;

window.addEventListener('load', async () => {
  const waitForClerk = () => {
    return new Promise((resolve) => {
      const check = () => {
        if (window.Clerk) {
          resolve(window.Clerk);
        } else {
          setTimeout(check, 50);
        }
      };
      check();
    });
  };

  const Clerk = await waitForClerk();

  Clerk.load().then(() => {
    Clerk.mountSignIn('#sign-in');
    Clerk.mountUserButton('#user-button');

    Clerk.addListener(async (event) => {
      if (event.type === 'signed-in') {
        document.getElementById("upload-section").style.display = "block";
        document.getElementById("user-button").style.display = "block";
        document.getElementById("sign-in").style.display = "none";

        authToken = await Clerk.session.getToken();
        loadFiles();
      }

      if (event.type === 'signed-out') {
        document.getElementById("upload-section").style.display = "none";
        document.getElementById("user-button").style.display = "none";
        document.getElementById("sign-in").style.display = "block";
        authToken = null;
      }
    });
  });
});

async function uploadFile() {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return alert("No file selected!");

  const res = await fetch("http://localhost:3000/generate-url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`
    },
    body: JSON.stringify({
      filename: file.name,
      filetype: file.type
    })
  });

  const { url } = await res.json();

  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": file.type
    },
    body: file
  });

  alert("File uploaded ✅");
  loadFiles();
}

async function loadFiles() {
  const res = await fetch("http://localhost:3000/list-files", {
    headers: { Authorization: `Bearer ${authToken}` }
  });

  const { files } = await res.json();
  const fileList = document.getElementById("fileList");
  fileList.innerHTML = "";

  for (const file of files) {
    const size = (file.size / 1024).toFixed(1) + " KB";
    const ext = file.key.split('.').pop();

    const div = document.createElement("div");
    div.innerHTML = `
      <b>${file.key}</b> (${ext}, ${size})<br/>
      <button onclick="previewFile('${file.key}')">Preview</button>
      <button onclick="deleteFile('${file.key}')">Delete</button>
    `;
    fileList.appendChild(div);
  }
}

async function previewFile(key) {
  const res = await fetch(`http://localhost:3000/file-url/${key}`, {
    headers: { Authorization: `Bearer ${authToken}` }
  });

  const { url } = await res.json();
  window.open(url, "_blank");
}

async function deleteFile(key) {
  const res = await fetch(`http://localhost:3000/delete-file/${key}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${authToken}` }
  });

  if (res.ok) {
    alert("File deleted ❌");
    loadFiles();
  } else {
    alert("Error deleting file");
  }
}
