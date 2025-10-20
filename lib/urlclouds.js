const fs = require('fs-extra');
const axios = require('axios');
const FormData = require('form-data');
const fetch = require('node-fetch');

//EliteProTech-Cloud Storage
async function uploadToEliteProTechUrl(file, filename = 'file.jpg') {
  if (!file) throw new Error("No file provided for upload.");

  const form = new FormData();
  if (Buffer.isBuffer(file)) form.append("file", file, filename);
  else if (typeof file === "string" && fs.existsSync(file)) form.append("file", fs.createReadStream(file));
  else throw new Error("Invalid file input");

  const res = await fetch("https://eliteprotech-url.zone.id/api/upload", {
    method: "POST",
    body: form
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Upload failed");

  return data.public_url;
}

//EliteProTech-Temporary Storage
async function uploadToEliteTempUrl(file, filename = 'tempfile.jpg') {
  if (!file) throw new Error("No file provided for upload.");

  const form = new FormData();
  if (Buffer.isBuffer(file)) {
    form.append("file", file, filename);
  } else if (typeof file === "string" && fs.existsSync(file)) {
    form.append("file", fs.createReadStream(file), { filename }); // <-- fixed
  } else {
    throw new Error("Invalid file input");
  }

  const res = await axios.post("https://eliteprotech-apis.zone.id/tempurl", form, {
    headers: form.getHeaders()
  });

  if (!res.data.success) throw new Error(res.data.error || "Upload failed");

  return res.data.url;
}

//Catbox
async function uploadToCatbox(filePath) {
  if (!fs.existsSync(filePath)) throw new Error("File not found.");

  const form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append('fileToUpload', fs.createReadStream(filePath));

  const res = await axios.post('https://catbox.moe/user/api.php', form, {
    headers: form.getHeaders()
  });

  return res.data.trim();
}

module.exports = {
  uploadToEliteProTechUrl,
  uploadToEliteTempUrl,
  uploadToCatbox
};