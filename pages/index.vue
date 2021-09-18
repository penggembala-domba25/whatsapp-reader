<template>
  <div class="body-container">
    <navbar-page />
    <div class="content">
      <div>
        <controller-file 
          @readFile="this.readFile"
          @clearFile="clearFile()"
          @downloadPdf="downloadPdf()"
          @downloadJSON="downloadJSON()"
          @changeUser="changeUser"
          :file="this.file" 
          :progress="this.progress"
          :resultReader="this.resultReader"
        />
      </div>
      
      <client-only>
        <vue-html2pdf
          :show-layout="false"
          :float-layout="false"
          :enable-download="true"
          :preview-modal="true"
          :paginate-elements-by-height="1100"
          :filename="getFilenameExport"
          :pdf-quality="2"
          :manual-pagination="false"
          pdf-format="a3"
          pdf-orientation="portrait"
          pdf-content-width="100%"
          @progress="onProgress($event)"
          ref="html2Pdf"
        >
          <section slot="pdf-content">
            <result-reader 
              :resultReader=this.resultReader 
            />
          </section>
        </vue-html2pdf>
      </client-only>    
    </div>
    <footer-page />
  </div>
  
</template>

<script>
import NavbarPage from "@/components/NavbarPage"
import ControllerFile from "@/components/ControllerFile"
import ResultReader from "@/components/ResultReader";
import FooterPage from "@/components/FooterPage";
import convert_to_json from "../static/convert_to_json"

export default {
  data() {
    return {
      file: null,
      resultReader: null,
      progress: 0
    } 
    
  },
  computed: {
    isGenerating() {
      return this.progress !== 0 && this.progress !== 100
    },
    getFilename() {
      if(this.file) {
        return this.file.name
      }
    },
    getFilenameExport() {
      if(this.file) {
        return this.file.name.replace(/\.\w+/g, `-${new Date().getTime()}`)
      }
    }
  },
  methods: {
    onProgress(progress) {
      this.progress = progress;
    },
    downloadPdf() {
      this.$refs.html2Pdf.generatePdf();

      setTimeout(() => {
        this.onProgress(0)
      }, 10000);
    },
    downloadJSON() {
      this.onProgress(Math.round(Math.random() * 70))
      
      let text = JSON.stringify(this.resultReader, null, 2);
      let filename = `${this.getFilenameExport + ".json"}`;
      let element = document.createElement('a');
      element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();
      document.body.removeChild(element);

      this.onProgress(100)

      setTimeout(() => {
        this.onProgress(0)
      }, 10000)
    },
    reader(file){
      return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.onload = () => resolve(fileReader.result);
          fileReader.onerror = () => reject(fileReader.error);
          fileReader.readAsText(file);
      });
    },
    readFile(event) {
      event.preventDefault()
      
      const file = event.target.files || event.dataTransfer.files

      if(file.length > 0) {
        this.file = file[0]

        this.reader(file[0])
          .then(result => this.resultReader = convert_to_json(result))
          .catch(error => console.log(error))
      }
    },
    changeUser(event) {
      event.preventDefault();

      let selectedUser = event.target.ariaValueText
      let indexSelectedUser = this.resultReader.users.indexOf(selectedUser)

      if(this.resultReader.users.includes(selectedUser)) {
        if(indexSelectedUser > -1) {
          this.resultReader.users.splice(indexSelectedUser, 1)
          this.resultReader.users.unshift(selectedUser)
        }
      }
    },
    clearFile() {
      this.file = null 
      this.resultReader = null
      
      this.progress = 0
    }
  },
  components: {
    NavbarPage,
    ControllerFile,
    ResultReader,
    FooterPage
  }  
}
</script>