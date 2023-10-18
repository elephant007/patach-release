const express = require("express")
const cheerio = require("cheerio")
const fetch = require("node-fetch")

const app = express()
const port = 3000

app.get("/patch-release", (req, res) => {
  // res.send('Hello World!')
  var version = req.query.version || "881"
  if (parseInt(version) === 2301 ){
   const response = {
      "Product Area": [
        {
          "title": "Low-code Application Development'23",
          "data": "&#8226;&nbsp;&nbsp;Application development tools help you create high-quality, efficient, and flexible applications. Key enhancements in this release of Pega Platform™ deliver valuable guidance for application developers and expand App Studio functionality to provide a variety of low-code tools to meet more needs of citizen developers"
        },
        {
          "title": "Case Management",
          "data": "&#8226;&nbsp;&nbsp;Learn more about the newest features available in Pega Platform's intuitive low-code environment. The latest Case Management update introduces a range of enhancements centered around generative AI integration, workflow efficiency, and user convenience."
        },
        {
          "title": "Conversational Channels'23",
          "data": "&#8226;&nbsp;&nbsp;Pega Intelligent Virtual Assistant™ (IVA) and Pega Email Bot™ use artificial intelligence and natural language processing (NLP) to help provide essential business services to users in a conversational and consistent way, without users having to interact with a human agent."
        },
        {
          "title": "Data Management and Integration in '23 ",
          "data": "&#8226;&nbsp;&nbsp;New features in Pega Platform™ improve how you integrate your application with various external sources and build an effective data model."
        },
        {
          "title": "Decision Management '23",
          "data": "&#8226;&nbsp;&nbsp;Significant usability enhancements improve the overall user experience of decision management and enable you to meet the ever-changing needs of your customers. The key enhancements include asynchronous processing when saving data to Decision Data Store data sets."
        },
        {
          "title": "DevOps and Automated Testing '23",
          "data": "&#8226;&nbsp;&nbsp;DevOps has no enhancements in this release of Pega Platform™."
        },
        {
          "title": "Generative AI",
          "data": "&#8226;&nbsp;&nbsp;Starting with Pega Platform™ '23, Pega supports Pega Cloud® clients to use Pega GenAI™ by providing access to OpenAI. As a result, you can use out-of-the-box Pega GenAI Rules that are provided in Pega Platform™ or customize Connect Generative AI Rules to fit your development needs."
        },
        {
          "title": "Mobile '23",
          "data": "&#8226;&nbsp;&nbsp;Learn more about the newest features available in Pega Platform™'s intuitive low-code environment for creating mobile apps. With Pega Mobile, you can quickly build apps that feature a modern run-time UI, ensuring a great experience for your mobile users."
        },
        {
          "title": "Reporting '23",
          "data": "&#8226;&nbsp;&nbsp;Pega Platform™ '23 extends the scope of practical functionalities to help you create comprehensive Insights with meaningful data from your application. The enhancements enable you to author Insights more intuitively by introducing usability updates, and provide convenient tools to report on specific data that you require at the moment."
        },
        {
          "title": "Security '23",
          "data": "&#8226;&nbsp;&nbsp;Pega Platform™ security features protect you against a wide variety of security risks, whether inadvertent or malicious. Key enhancements in this release of Pega Platform include support for preventing exposure of data due to covered relationships and support for seamless access to web embeds in Constellation UI."
        },
        {
          "title": "System Administration '23",
          "data": "&#8226;&nbsp;&nbsp;The latest system administration features help improve data indexing performance in the Search and Reporting Service for Pega Platform™, and help enhance database connectivity resilience."
        },
        {
          "title": "User Experience '23 ",
          "data": "&#8226;&nbsp;&nbsp;The '23 version of the Pega Platform™ introduces new developments in UI architecture and design to help you build applications with a robust interface that remains responsive, intuitive, and meets all your business needs."
        }
      ]
    }
   res.json(response) 
  }
else{

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
            patchRelease[backlog] =patchRelease[backlog]+
            `<br/><br/>&#8226;&nbsp;&nbsp;${$(columns[3]).text()}`;
          } else {
            patchRelease[backlog] = `&#8226;&nbsp;&nbsp;${$(columns[3]).text()}`
          }
        }
      })
      const response = []
      Object.keys(patchRelease).map((item) => {
        const temp = {
          title: item,
          data: patchRelease[item],
        }
        response.push(temp)
      })

      res.json({ "Product Area": response })
    })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
