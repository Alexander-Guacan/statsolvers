import { getImg, getJson } from "../utils/utils"

const url = 'http://localhost:3838/numeric'

const bodyRequest = {
  about: "",
  column: "",
  confidence_level: 0.95
}

export async function getHistogram({ column }) {
  bodyRequest.about = "histogram"
  bodyRequest.column = column

  return getImg({ url: url, body: bodyRequest })
}

export async function getOgive({ column }) {
  bodyRequest.about = "ogive"
  bodyRequest.column = column

  return getImg({ url: url, body: bodyRequest })
}

export async function getBoxplot({ column }) {
  bodyRequest.about = "boxplot"
  bodyRequest.column = column

  return getImg({ url: url, body: bodyRequest })
}

export async function getCentralTendencyMeasures({ column }) {
  bodyRequest.about = "central_tendency_measures"
  bodyRequest.column = column

  return getJson({ url: url, body: bodyRequest })
}

export async function getDispersionMeasures({ column }) {
  bodyRequest.about = "dispersion_measures"
  bodyRequest.column = column

  return getJson({ url: url, body: bodyRequest })
}

export async function getShapeMeasures({ column }) {
  bodyRequest.about = "shape_measures"
  bodyRequest.column = column

  return getJson({ url: url, body: bodyRequest })
}

export async function getMeanConfidenceInterval({ column, confidenceLevel }) {
  bodyRequest.about = "mean_confidence_interval"
  bodyRequest.column = column
  bodyRequest.confidence_level = confidenceLevel

  return getJson({ url: url, body: bodyRequest })
}

export async function getVarianceConfidenceInterval({ column, confidenceLevel }) {
  bodyRequest.about = "variance_confidence_interval"
  bodyRequest.column = column
  bodyRequest.confidence_level = confidenceLevel

  return getJson({ url: url, body: bodyRequest })
}