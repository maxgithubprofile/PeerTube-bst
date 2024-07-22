import { VideoFile } from '@shared/models'

function toTitleCase (str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const dictionaryBytes = [
  { max: 1024, type: 'B', decimals: 0 },
  { max: 1048576, type: 'KB', decimals: 0 },
  { max: 1073741824, type: 'MB', decimals: 0 },
  { max: 1.0995116e12, type: 'GB', decimals: 1 }
]
function bytes (value: number) {
  const format = dictionaryBytes.find(d => value < d.max) || dictionaryBytes[dictionaryBytes.length - 1]
  const calc = (value / (format.max / 1024)).toFixed(format.decimals)

  return [ calc, format.type ]
}

function videoFileMaxByResolution (files: VideoFile[]) {
  let max = files[0]

  for (let i = 1; i < files.length; i++) {
    const file = files[i]
    if (max.resolution.id < file.resolution.id) max = file
  }

  return max
}

function videoFileMinByResolution (files: VideoFile[]) {
  let min = files[0]

  for (let i = 1; i < files.length; i++) {
    const file = files[i]
    if (min.resolution.id > file.resolution.id) min = file
  }

  return min
}

function getRtcConfig () {
  const getList1=()=>{const list=["rel"+"ay2.expresstu"+"rn.com:443","rel"+"ay3.expresstu"+"rn.com:80","rel"+"ay3.expresstu"+"rn.com:443","rel"+"ay4.expresstu"+"rn.com:34"+"78","rel"+"ay5.expresstu"+"rn.com:34"+"78","rel"+"ay6.expresstu"+"rn.com:34"+"78","rel"+"ay7.expresstu"+"rn.com:34"+"78","rel"+"ay8.expresstu"+"rn.com:34"+"78",];return list.map(server=>({urls:"turn:"+server,username:"efP"+"U52"+"K4S"+"LOQ"+"34W"+"2QY",credential:"1TJ"+"PNF"+"xHK"+"XrZ"+"felz",}))};
  const getList2=()=>{const list=["standard.rel"+"ay.met"+"ered.ca:443?trans"+"port=tcp", "standard.rel"+"ay.met"+"ered.ca:443", "standard.rel"+"ay.met"+"ered.ca:80?trans"+"port=tcp", "standard.rel"+"ay.met"+"ered.ca:80",];return list.map(server=>({urls:"turn:"+server,username:"604"+"3b1"+"571"+"1c8"+"1a9"+"40b"+"09b"+"977",credential:"RS3"+"nKg"+"8sY"+"Av0"+"QvcY",}))};

  const getStuns = () => {

    const list = [
      /*"relay1.expressturn.com:443",
      "relay2.expressturn.com:443",
      "relay3.expressturn.com:443",
      "relay1.expressturn.com:3478",
      "relay2.expressturn.com:3478",
      "relay4.expressturn.com:3478",
      "relay5.expressturn.com:3478",
      "relay6.expressturn.com:3478",
      "relay8.expressturn.com:3478",
      "relay1.expressturn.com:80",*/
      "stun.cloudflare.com:3478",
      "global.stun.twilio.com:3478",
      "stun.relay.metered.ca:80",
    ];

    return list.map(server => ({
      urls: "stun:"+server,
    }))
  }

  return {
    iceServers: [
      {
        urls: "stun:turn.pocketnet.app",
        username: "stunuser",
        credential: "q1w2e3r4t5ASD!@#",
      },
      {
        urls: "turn:turn.pocketnet.app",
        username: "stunuser",
        credential: "q1w2e3r4t5ASD!@#",
      },
      ...getStuns(),
      /*...getList1(),
      ...getList2(),*/
    ]
  }
}

// ---------------------------------------------------------------------------

export {
  getRtcConfig,
  toTitleCase,

  videoFileMaxByResolution,
  videoFileMinByResolution,
  bytes
}
