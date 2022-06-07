// import plugin from 'tailwindcss/plugin'
// import kit from '@fission-suite/kit'
// const plugin = require("tailwindcss/plugin");
// const kit = require("@fission-suite/kit");


import plugin from "tailwindcss/plugin"
import * as kit from "@fission-suite/kit"
// or kit = require("@fission-suite/kit")

export default {
  purge: [
    ...kit.tailwindPurgeList()
  ],

  theme: {
    colors: kit.dasherizeObjectKeys(kit.colors),
    fontFamily: kit.fonts,

    extend: {
      fontSize: kit.fontSizes
    }
  },

  plugins: [
    plugin(function({ addBase }) {
      // this `fontsPath` will be the relative path
      // to the fonts from the generated stylesheet
      kit.fontFaces({ fontsPath: "/fonts/" }).forEach(fontFace => {
        addBase({ "@font-face": fontFace })
      })
    })
  ]
}




// export default {
//   purge: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//     "./index.html",
//     ...kit.tailwindPurgeList(),
//   ],
//   darkMode: false, // or 'media' or 'class'
//   theme: {
//     colors: kit.dasherizeObjectKeys(kit.colors),
//     fontFamily: kit.fonts,
//   },
//   variants: {
//     opacity: ["group-hover"],
//   },
//   plugins: [
//     plugin(function ({ addBase }) {
//       // this `fontsPath` will be the relative path
//       // to the fonts from the generated stylesheet
//       kit.fontFaces({ fontsPath: "./fonts/" }).forEach((fontFace) => {
//         addBase({ "@font-face": fontFace });
//       });
//     }),
//   ],
// }





// // module.exports = {
// //   purge: [
// //     "./src/**/*.{js,jsx,ts,tsx}",
// //     "./index.html",
// //     ...kit.tailwindPurgeList(),
// //   ],
// //   darkMode: false, // or 'media' or 'class'
// //   theme: {
// //     colors: kit.dasherizeObjectKeys(kit.colors),
// //     fontFamily: kit.fonts,
// //   },
// //   variants: {
// //     opacity: ["group-hover"],
// //   },
// //   plugins: [
// //     plugin(function ({ addBase }) {
// //       // this `fontsPath` will be the relative path
// //       // to the fonts from the generated stylesheet
// //       kit.fontFaces({ fontsPath: "./fonts/" }).forEach((fontFace) => {
// //         addBase({ "@font-face": fontFace });
// //       });
// //     }),
// //   ],
// // };
