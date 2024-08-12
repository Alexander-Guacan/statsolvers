import { getImg, getJson } from "../utils/utils"

const url = 'http://localhost:3838/categoric'

const bodyRequest = {
  about: "",
  column: "",
  confidence_level: 0.95
}

export async function getBarplot({ column }) {
  bodyRequest.about = "barplot"
  bodyRequest.column = column

  return getImg({ url: url, body: bodyRequest })
}

export async function getPie({ column }) {
  bodyRequest.about = "pie"
  bodyRequest.column = column

  return getImg({ url: url, body: bodyRequest })
}

export async function getFrequencyTable({ column }) {
  bodyRequest.about = "frequency"
  bodyRequest.column = column

  return getJson({ url: url, body: bodyRequest })
}

export async function getProportionConfidenceInterval({ column, confidenceLevel }) {
  bodyRequest.about = "confidence_interval"
  bodyRequest.column = column
  bodyRequest.confidence_level = confidenceLevel

  return getJson({ url: url, body: bodyRequest })
}