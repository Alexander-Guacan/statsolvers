import { useState } from "react"
import { useMultivariableAnalysis } from "../hooks/useMultivariableAnalysis"
import { translateColumnName } from "../utils/utils"
import { CheckBox } from "../components/common/CheckBox"
import { CardPlot } from "../components/common/CardPlot"
import { CardTable } from "../components/common/CardTable"

export function Multivariable() {
  const {
    plot,
    table
  } = useMultivariableAnalysis()
  const [hidePlot] = useState('card-plot--hidden')
  const [plotVisibility, setPlotVisibility] = useState('')

  const switchPlotVisibility = () => {
    setPlotVisibility(plotVisibility.length ? '' : hidePlot)
  }

  return (
    <main className="main">
      <h2 className="title">
        {`${translateColumnName("final_price")} vs ${translateColumnName("storage")} y ${translateColumnName("ram")}`}
      </h2>
      <article className="summary">
        <h3 className="subtitle">Resumen</h3>
        <p className="paragraph">
          El modelo sugiere que la relación entre el almacenamiento y el precio es positiva, es decir, un aumento en el almacenamiento tiende a estar asociado con un incremento en el precio. De manera similar, un aumento en la RAM también está asociado con un aumento en el precio. Entre las dos variables, la RAM parece tener una influencia más fuerte sobre el precio que el almacenamiento, lo que podría indicar que los consumidores o fabricantes valoran más la capacidad de procesamiento y la eficiencia de la memoria que el espacio de almacenamiento.
        </p>
      </article>
      <section className="layout">
        <header className="layout__controls">
          <form className="form">
            <fieldset>
              <legend>Diagramas</legend>
              <CheckBox id="plot-histogram" handleChange={switchPlotVisibility} defaultChecked>
                Grafico
              </CheckBox>
            </fieldset>
          </form>
        </header>
        <div className="layout__output">
          <section className="cards">
            <CardPlot className={plotVisibility} img={plot} />
          </section>
          <section className="tables">
            <CardTable
              title={table.title}
              headers={table.headers}
              rows={table.rows}
            />
          </section>
        </div>
      </section>
    </main>
  )
}