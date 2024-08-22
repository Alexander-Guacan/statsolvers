library(httpuv)
library(jsonlite)
library(psych)
library(EnvStats)

dataset <- read.csv("./backend/smartphones.csv")[
  , c("Brand", "RAM", "Storage", "Color", "Free", "Final.Price")
]

dataset <- na.omit(dataset)

names(dataset)[names(dataset) == "Brand"] <- "brand"
names(dataset)[names(dataset) == "RAM"] <- "ram"
names(dataset)[names(dataset) == "Storage"] <- "storage"
names(dataset)[names(dataset) == "Color"] <- "color"
names(dataset)[names(dataset) == "Free"] <- "free"
names(dataset)[names(dataset) == "Final.Price"] <- "final_price"

brands <- data.frame(table(dataset$brand))
brands <- brands[order(brands$Freq), ]

main_brands <- brands$Var1[cumsum(brands$Freq / sum(brands$Freq)) >= 0.20]

dataset$brand[!(dataset$brand %in% main_brands)] <- "Others"

numeric_columns <- c("ram", "storage", "final_price")
categoric_columns <- c("brand", "color", "free")

spanish_column <- function(column_name) {
  switch(column_name,
    brand = "Marca",
    ram = "RAM",
    storage = "Almacenamiento",
    color = "Color",
    free = "Compañia móvil",
    final_price = "Precio",
    return("Desconocido")
  )
}

spanish_categories <- function(column_name) {
  switch(column_name,
    brand = levels(as.factor(dataset$brand)),
    color = c(
      "Negro", "Azul", "Bronce", "Cafe",
      "Cristal", "Dorado", "Gris", "Verde",
      "Naranja", "Rosado", "Morado", "Arcoiris",
      "Rojo", "Plata", "Turquesa", "Blanco",
      "Amarillo"
    ),
    free = c("No", "Si")
  )
}

colors_category <- function(column_name) {
  switch(column_name,
    brand = rainbow(n = length(levels(as.factor(dataset$brand)))),
    color = c(
      "black", "blue", "#CD7F32", "brown",
      "#A7D8DE", "gold", "gray", "green",
      "orange", "pink", "purple", "maroon",
      "red", "#C0C0C0", "turquoise", "white",
      "yellow"
    ),
    free = c("firebrick", "seagreen")
  )
}

color_numeric <- function(column_name) {
  switch(column_name,
    ram = c("darkorange"),
    storage = c("royalblue"),
    final_price = c("seagreen")
  )
}

barplot_img <- function(
    column,
    xlabel,
    categories_labels,
    colors = "lightgray") {
  temp_file <- tempfile(fileext = ".png")
  png(temp_file, width = 800, height = 800)

  par(mar = c(5, 4, 4, 8))

  barplot(
    table(column),
    main = "Diagrama de barras",
    xlab = xlabel,
    ylab = "Frecuencia",
    col = colors
  )

  legend(
    "topright",
    inset = c(-0.15, 0),
    title = xlabel,
    legend = categories_labels,
    fill = colors,
    xpd = TRUE
  )

  dev.off()
  img <- readBin(temp_file, "raw", n = file.info(temp_file)$size)
  unlink(temp_file)

  return(img)
}

pie_img <- function(
    column,
    legend_title,
    categories_labels,
    colors = "lightgray") {
  temp_file <- tempfile(fileext = ".png")
  png(temp_file, width = 800, height = 800)

  par(mar = c(5, 4, 4, 8))

  pie(
    table(column),
    main = "Diagrama de pastel",
    labels = "",
    col = colors,
  )

  legend(
    "topright",
    inset = c(-0.15, 0),
    title = legend_title,
    legend = categories_labels,
    fill = colors,
    xpd = TRUE
  )

  dev.off()
  img <- readBin(temp_file, "raw", n = file.info(temp_file)$size)
  unlink(temp_file)

  return(img)
}

frequency_table <- function(column) {
  table <- data.frame(table(column))
  relative_frequency <- round(table$Freq / length(column), 4)
  cumulative_frequency <- cumsum(table$Freq)
  table <- data.frame(
    category = table$column,
    absolute_frequency = table$Freq,
    relative_frequency,
    cumulative_frequency
  )
  return(table)
}

proportion_confidence_interval <- function(column, confidence_level = 0.95) {
  categories <- levels(factor(column, ordered = TRUE))
  confidence_intervals <- data.frame()

  for (category in categories) {
    x <- sum(column == category)
    n <- length(column)
    p <- x / n

    confidence_interval <- binom.test(
      x = x, n = n,
      p = p, conf.level = confidence_level
    )$conf.int

    confidence_interval <- data.frame(
      category = category,
      min = confidence_interval[1],
      p = p,
      max = confidence_interval[2]
    )

    confidence_intervals <- rbind(
      confidence_intervals,
      confidence_interval
    )
  }

  return(confidence_intervals)
}

histogram_img <- function(
    column,
    xlabel,
    color = "lightgray") {
  temp_file <- tempfile(fileext = ".png")
  png(temp_file, width = 800, height = 800)

  hist(
    column,
    main = "Histograma",
    xlab = xlabel,
    ylab = "Conteo",
    col = color
  )

  dev.off()
  img <- readBin(temp_file, "raw", n = file.info(temp_file)$size)
  unlink(temp_file)

  return(img)
}

ogive_img <- function(
    column,
    xlabel,
    color) {
  temp_file <- tempfile(fileext = ".png")
  png(temp_file, width = 800, height = 800)

  histogram <- hist(column, plot = FALSE)

  plot(
    cumsum(histogram$counts),
    main = "Ojiva de Frecuencias",
    xlab = xlabel,
    ylab = "Conteo",
    col = color
  )

  lines(cumsum(histogram$counts), col = color)

  dev.off()
  img <- readBin(temp_file, "raw", n = file.info(temp_file)$size)
  unlink(temp_file)

  return(img)
}

boxplot_img <- function(
    column,
    xlabel,
    color) {
  temp_file <- tempfile(fileext = ".png")
  png(temp_file, width = 800, height = 800)

  boxplot(
    column,
    main = "Diagrama de cajas",
    xlab = xlabel,
    col = color
  )

  dev.off()
  img <- readBin(temp_file, "raw", n = file.info(temp_file)$size)
  unlink(temp_file)

  return(img)
}

calculate_mode <- function(data) {
  as.numeric(names(which.max(table(data))))
}

central_tendency_measures <- function(column) {
  data.frame(
    mean = mean(column),
    median = median(column),
    mode = calculate_mode(column)
  )
}

dispersion_measures <- function(column) {
  data.frame(
    variance = var(column),
    standard_deviation = sd(column),
    range = max(column) - min(column),
    variation_coefficient = sd(column) / abs(mean(column))
  )
}

shape_measures <- function(column) {
  descriptions <- describe(column)
  data.frame(
    skewness = descriptions$skew,
    kurtosis = descriptions$kurtosis
  )
}

mean_confidence_interval <- function(column, confidence_level = 0.95) {
  mu <- mean(column)
  confidence_interval <- t.test(
    column,
    mu = mu,
    alternative = "two.sided",
    conf.level = confidence_level
  )$conf.int

  data.frame(
    min = confidence_interval[1],
    mu = mu,
    max = confidence_interval[2]
  )
}

variance_confidence_interval <- function(column, confidence_level = 0.95) {
  sigma_squared <- var(column)
  confidence_interval <- varTest(
    column,
    sigma.squared = sigma_squared,
    alternative = "two.sided",
    conf.level = confidence_level
  )$conf.int

  data.frame(
    min = confidence_interval[1],
    sigma_squared = sigma_squared,
    max = confidence_interval[2],
    row.names = NULL
  )
}

scatter_numerics_img <- function(x, y, xlabel, ylabel, color) {
  temp_file <- tempfile(fileext = ".png")
  png(temp_file, width = 800, height = 800)

  plot(
    x, y,
    main = "Diagrama de Dispersión",
    xlab = xlabel,
    ylab = ylabel,
    col = color
  )

  dev.off()
  img <- readBin(temp_file, "raw", n = file.info(temp_file)$size)
  unlink(temp_file)

  return(img)
}

barplot_categorics_img <- function(x, y, xlabel, categories_labels, colors) {
  temp_file <- tempfile(fileext = ".png")
  png(temp_file, width = 800, height = 800)

  par(mar = c(5, 4, 4, 8))

  barplot(
    table(x, y),
    main = "Diagrama de barras",
    xlab = xlabel,
    ylab = "Frecuencia",
    col = colors,
    beside = TRUE
  )

  legend(
    "topright",
    inset = c(-0.15, 0),
    title = xlabel,
    legend = categories_labels,
    fill = colors,
    xpd = TRUE
  )

  dev.off()
  img <- readBin(temp_file, "raw", n = file.info(temp_file)$size)
  unlink(temp_file)

  return(img)
}

barplot_bivariable_img <- function(x, y, xlabel, categories_labels, colors) {
  temp_file <- tempfile(fileext = ".png")
  png(temp_file, width = 800, height = 800)

  par(mar = c(5, 4, 4, 8))

  categories_description <- describeBy(x, y)
  means_by_category <- sapply(
    categories_description,
    function(category) round(category$mean, 4)
  )

  barplot(
    means_by_category,
    main = "Diagrama de barras",
    xlab = xlabel,
    ylab = "Promedio",
    col = colors
  )

  legend(
    "topright",
    inset = c(-0.15, 0),
    title = xlabel,
    legend = categories_labels,
    fill = colors,
    xpd = TRUE
  )

  dev.off()
  img <- readBin(temp_file, "raw", n = file.info(temp_file)$size)
  unlink(temp_file)

  return(img)
}

handle_bivariable_plot <- function(x, y) {
  if (x %in% numeric_columns && y %in% numeric_columns) {
    return(scatter_numerics_img(
      x = dataset[, x],
      y = dataset[, y],
      xlabel = spanish_column(x),
      ylabel = spanish_column(y),
      color = color_numeric(x)
    ))
  }

  if (x %in% categoric_columns && y %in% categoric_columns) {
    return(barplot_categorics_img(
      x = dataset[, x],
      y = dataset[, y],
      xlabel = gettextf(
        "%s vs %s", spanish_column(x), spanish_column(y)
      ),
      categories_labels = spanish_categories(x),
      colors = colors_category(x)
    ))
  }

  if (x %in% categoric_columns) {
    temp <- x
    x <- y
    y <- temp
  }

  return(barplot_bivariable_img(
    x = dataset[, x],
    y = dataset[, y],
    xlabel = gettextf(
      "%s vs %s", spanish_column(y), spanish_column(x)
    ),
    categories_labels = spanish_categories(y),
    colors = colors_category(y)
  ))
}

handle_bivariable_info <- function(x, y) {
  if (x %in% numeric_columns && y %in% numeric_columns) {
    return(data.frame(
      correlation_coefficient = cor(dataset[, x], dataset[, y])
    ))
  }

  if (x %in% categoric_columns && y %in% categoric_columns) {
    return(as.data.frame.matrix((
      table(dataset[, x], dataset[, y])
    )))
  }

  if (x %in% categoric_columns) {
    temp <- x
    x <- y
    y <- temp
  }

  return(data.frame(mean = sapply(
    describeBy(dataset[, x], dataset[, y]),
    function(category) round(category$mean, 4)
  )))
}

mlr_coefficients <- function() {
  rlm <- lm(final_price ~ storage + ram, data = dataset)
  data.frame(
    intercept = rlm$coefficients[1],
    storage = rlm$coefficients[2],
    ram = rlm$coefficients[3],
    row.names = NULL
  )
}

mlr_img <- function() {
  temp_file <- tempfile(fileext = ".png")
  png(temp_file, width = 800, height = 800)

  plot(dataset$storage, dataset$final_price,
    main = "Modelo de regresión múltiple",
    xlab = gettextf(
      "%s y %s",
      spanish_column("storage"),
      spanish_column("ram")
    ),
    ylab = spanish_column("final_price"),
    pch = 19, col = color_numeric("storage"), ylim = c(
      min(dataset$final_price),
      max(dataset$final_price)
    )
  )

  par(new = TRUE)
  plot(dataset$ram, dataset$final_price,
    axes = FALSE, xlab = "", ylab = "",
    pch = 19, col = color_numeric("ram"), ylim = c(
      min(dataset$final_price),
      max(dataset$final_price)
    )
  )

  abline(
    lm(final_price ~ storage, data = dataset),
    col = color_numeric("storage"), lwd = 2
  )
  abline(
    lm(final_price ~ ram, data = dataset),
    col = color_numeric("ram"), lwd = 2
  )

  legend("topright",
    legend = c(
      spanish_column("storage"),
      spanish_column("ram")
    ),
    col = c(
      color_numeric("storage"),
      color_numeric("ram")
    ),
    pch = 19, lty = 1, lwd = 2
  )

  dev.off()
  img <- readBin(temp_file, "raw", n = file.info(temp_file)$size)
  unlink(temp_file)

  return(img)
}

cors_headers <- list(
  "Access-Control-Allow-Origin" = "*",
  "Access-Control-Allow-Methods" = "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers" = "Content-Type, Authorization"
)

plain_text_response <- function(status, body) {
  return(list(
    status = status,
    headers = c(cors_headers, "Content-Type" = "text/plain"),
    body = body
  ))
}

json_response <- function(status = 200L, body) {
  return(list(
    status = status,
    headers = c(cors_headers, "Content-Type" = "application/json"),
    body = toJSON(body)
  ))
}

img_response <- function(img) {
  return(list(
    status = 200L,
    headers = c(cors_headers, "Content-Type" = "image/png"),
    body = img
  ))
}

handle_categoric <- function(body) {
  tryCatch(
    {
      column_name <- body$column

      if (!(column_name %in% categoric_columns)) {
        return(plain_text_response(404L, "Column isn't categoric"))
      }

      about <- body$about
      switch(about,
        barplot = img_response(
          img = barplot_img(
            column = dataset[, column_name],
            xlabel = spanish_column(column_name),
            categories_labels = spanish_categories(column_name),
            colors = colors_category(column_name)
          )
        ),
        pie = img_response(
          img = pie_img(
            column = dataset[, column_name],
            legend_title = spanish_column(column_name),
            categories_labels = spanish_categories(column_name),
            colors = colors_category(column_name)
          )
        ),
        frequency = json_response(
          body = frequency_table(column = dataset[, column_name])
        ),
        confidence_interval = json_response(
          body = proportion_confidence_interval(
            column = dataset[, column_name],
            confidence_level = body$confidence_level
          )
        ),
        return(plain_text_response(
          status = 404L,
          body = "Unknown 'about' key value"
        ))
      )
    },
    error = function(cond) {
      return(plain_text_response(
        status = 404L,
        body = "Incomplete body request {about, column, confidence_level}"
      ))
    }
  )
}

handle_numeric <- function(body) {
  tryCatch(
    {
      column_name <- body$column

      if (!(column_name %in% numeric_columns)) {
        return(plain_text_response(404L, "Column isn't numeric"))
      }

      about <- body$about

      switch(about,
        histogram = img_response(
          img = histogram_img(
            column = dataset[, column_name],
            xlabel = spanish_column(column_name),
            color = color_numeric(column_name)
          )
        ),
        ogive = img_response(
          img = ogive_img(
            column = dataset[, column_name],
            xlabel = spanish_column(column_name),
            color = color_numeric(column_name)
          )
        ),
        boxplot = img_response(
          img = boxplot_img(
            column = dataset[, column_name],
            xlabel = spanish_column(column_name),
            color = color_numeric(column_name)
          )
        ),
        central_tendency_measures = json_response(
          body = central_tendency_measures(dataset[, column_name])
        ),
        dispersion_measures = json_response(
          body = dispersion_measures(dataset[, column_name])
        ),
        position_measures = json_response(
          body = quantile(dataset[, column_name])
        ),
        shape_measures = json_response(
          body = shape_measures(dataset[, column_name])
        ),
        mean_confidence_interval = json_response(
          body = mean_confidence_interval(
            column = dataset[, column_name],
            confidence_level = body$confidence_level
          )
        ),
        variance_confidence_interval = json_response(
          body = variance_confidence_interval(
            column = dataset[, column_name],
            confidence_level = body$confidence_level
          )
        ),
        return(plain_text_response(404L, "Unknown 'about' key value"))
      )
    },
    error = function(cond) {
      return(plain_text_response(
        status = 404L,
        body = "Incomplete body request {about, column, confidence_level}"
      ))
    }
  )
}

handle_bivariable <- function(body) {
  tryCatch(
    {
      x <- body$x
      y <- body$y

      if (x == y) {
        return(plain_text_response(
          status = 404L,
          body = "Columns x and y should be differents"
        ))
      }

      if (!(x %in% numeric_columns || x %in% categoric_columns)) {
        return(plain_text_response(
          status = 404L,
          body = "x variable isn't column"
        ))
      }

      if (!(y %in% numeric_columns || y %in% categoric_columns)) {
        return(plain_text_response(
          status = 404L,
          body = "y variable isn't column"
        ))
      }

      about <- body$about
      switch(about,
        plot = img_response(img = handle_bivariable_plot(x, y)),
        info = json_response(body = handle_bivariable_info(x, y)),
        return(plain_text_response(404L, "Unknown 'about' key value"))
      )
    },
    error = function(cond) {
      return(plain_text_response(
        status = 404L,
        body = "Incomplete body request {about, x, y}"
      ))
    }
  )
}

handle_multivariable <- function(body) {
  tryCatch(
    {
      about <- body$about
      switch(about,
        plot = img_response(img = mlr_img()),
        info = json_response(body = mlr_coefficients())
      )
    },
    error = function(cond) {
      return(plain_text_response(
        status = 404L,
        body = "Incomplete body request {about}"
      ))
    }
  )
}

handle_post <- function(request) {
  unknown_endpoint_response <- plain_text_response(
    status = 404L,
    body = "Unknown POST endpoint"
  )

  path <- request$PATH_INFO

  tryCatch(
    {
      body <- fromJSON(rawToChar(request$rook.input$read()))

      switch(path,
        "/categoric" = handle_categoric(body),
        "/numeric" = handle_numeric(body),
        "/bivariable" = handle_bivariable(body),
        "/multivariable" = handle_multivariable(body),
        return(unknown_endpoint_response)
      )
    },
    error = function(cond) {
      return(plain_text_response(
        status = 404L,
        body = "Body request not defined"
      ))
    }
  )
}

routes <- function(request) {
  if (request$REQUEST_METHOD == "OPTIONS") {
    return(list(
      status = 200L,
      headers = cors_headers,
      body = ""
    ))
  }

  unknown_method_response <- plain_text_response(
    status = 404L,
    body = "Method not defined"
  )

  switch(request$REQUEST_METHOD,
    POST = handle_post(request),
    return(unknown_method_response)
  )
}

server <- startServer(
  host = "0.0.0.0",
  port = 3838,
  app = list(call = routes)
)
