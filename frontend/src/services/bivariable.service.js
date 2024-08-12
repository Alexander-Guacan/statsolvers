import { getImg, getJson } from "../utils/utils"

const url = 'http://localhost:3838/bivariable'

const bodyRequest = {
  x: "",
  y: "",
  about: ""
}

export async function getBivariablePlot({ columnX, columnY }) {
  bodyRequest.about = "plot"
  bodyRequest.x = columnX
  bodyRequest.y = columnY

  return getImg({ url: url, body: bodyRequest })
}

export async function getBivariableInfo({ columnX, columnY }) {
  bodyRequest.about = "info"
  bodyRequest.x = columnX
  bodyRequest.y = columnY

  return getJson({ url: url, body: bodyRequest })
}