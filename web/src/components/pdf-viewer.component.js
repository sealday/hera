import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import zh_CN from '@react-pdf-viewer/locales/lib/zh_CN.json'

const PDFViewer = ({ url, printRef}) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()
  printRef.current = defaultLayoutPluginInstance.toolbarPluginInstance.printPluginInstance
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.1.81/build/pdf.worker.min.js">
      <Viewer
        localization={zh_CN}
        fileUrl={url}
        plugins={[
          defaultLayoutPluginInstance,
        ]}
      />
    </Worker>
  )
}

export default PDFViewer