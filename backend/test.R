library(EnvStats)

dataset <- read.csv("./smartphones.csv")[
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
