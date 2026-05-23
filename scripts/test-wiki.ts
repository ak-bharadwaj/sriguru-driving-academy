import axios from 'axios'

async function run() {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&generator=categorymembers&gcmtitle=Category:SVG_warning_road_signs_of_India&gcmlimit=5&prop=imageinfo&iiprop=extmetadata&format=json'
  try {
    const res = await axios.get(url, { headers: { 'User-Agent': 'SriGuru/1.0' } })
    console.log(JSON.stringify(res.data, null, 2))
  } catch(e) {
    console.error(e)
  }
}
run()
