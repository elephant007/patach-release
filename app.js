const express = require("express")
const cheerio = require("cheerio")
const fetch = require("node-fetch")

const app = express()
const port = 3000

app.get("/patch-release", (req, res) => {
  // res.send('Hello World!')
  var version = req.query.version || "881"
  fetch(
    `https://support.pega.com/support-doc/pega-platform-${version}-patch-resolved-issues`
  )
    .then((res) => res.text())
    .then((ress) => {
      // Load the HTML string into a cheerio instance
      const $ = cheerio.load(ress)
      // Create an array to store the "Country" column data
      const patchRelease = new Object()

      $("table tbody tr").each((index, row) => {
        const columns = $(row).find("td")
        if (columns.length === 5) {
          const backlog = $(columns[4]).text()
          if (patchRelease[backlog]) {
            patchRelease[backlog].push($(columns[3]).text())
          } else {
            patchRelease[backlog] = new Array($(columns[3]).text())
          }
        }
      })
      const response = []
      Object.keys(patchRelease).map((item) => {
        const temp = {
          title: item,
          data: JSON.stringify(patchRelease[item]),
        }
        response.push(temp)
      })

      res.json({ "Product Area": response })
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
