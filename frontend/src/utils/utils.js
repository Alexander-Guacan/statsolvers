export function translateColumnName(columnName) {
    const translations = {
        'ram': 'RAM',
        'storage': 'Almacenamiento',
        'final_price': 'Precio Final',
        'brand': 'Marca',
        'color': 'Color',
        'free': "Compañia Móvil"
    }

    return translations[columnName]
}

export function isContingencyTable(table) {
    return Object.keys(table[0]).some(column => column === '_row')
}

export function hasMeanByCategory(table) {
    return Object.keys(table[0]).some(column => column === 'mean')
}

export function getColumnCategories(table) {
    return Object.keys(table[0]).filter(category => category !== '_row')
}

export function formatTable(table, columnX, columnY) {
    if (!isContingencyTable(table)) {
        return {
            title: `${columnX} / ${columnY}`,
            headers: ["coeficiente de correlación"],
            rows: table
        }
    }

    if (hasMeanByCategory(table)) {
        return {
            title: "Tabla de contingencia",
            headers: ["categoria", "promedio"],
            rows: table
        }
    }

    return {
        title: "tabla de contingencia",
        headers: ["categoria", ...getColumnCategories(table)],
        rows: table
    }
}

export async function sendRequest({ url, body }) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
    return response
}

export async function getImg({ url, body }) {
    return sendRequest({ url: url, body: body })
        .then(response => response.blob())
        .then(blob => URL.createObjectURL(blob))
}

export async function getJson({ url, body }) {
    return sendRequest({ url: url, body: body })
        .then(response => response.json())
}