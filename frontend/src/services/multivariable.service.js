import { getImg, getJson } from "../utils/utils"

const url = 'http://localhost:3838/multivariable'

const bodyRequest = {
  about: ""
}

export async function getMultivariablePlot() {
  bodyRequest.about = "plot"
  return getImg({ url: url, body: bodyRequest })
}

export async function getMultivariableInfo() {
  bodyRequest.about = "info"
  return getJson({ url: url, body: bodyRequest })
}