import fs from 'fs/promises'
import path from 'path'
import React from 'react'

export default async function SignsPage() {
  const signsDir = path.join(process.cwd(), 'public', 'signs')
  let files: string[] = []
  try {
    files = await fs.readdir(signsDir)
  } catch (err) {
    files = []
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>Road Signs</h1>
      {files.length === 0 ? (
        <p>No sign images found in <strong>/public/signs</strong>.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
          {files.map((file) => (
            <div key={file} style={{ border: '1px solid #eee', borderRadius: 8, padding: 8, textAlign: 'center' }}>
              <img
                src={`/signs/${file}`}
                alt={file}
                style={{ maxWidth: '100%', height: 120, objectFit: 'contain' }}
              />
              <div style={{ marginTop: 8, fontSize: 13 }}>{file.replace(/\.svg$/i, '').replace(/[-_]/g, ' ')}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
