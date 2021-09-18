<template>
    <div class="controller-file">
        <b-container fluid>
            <b-row
                align-h="center"
                align-v="center"
            >
                <b-col
                    xl="4"
                    lg="5"
                    md="6"
                    sm="8"
                    xs="10"
                >
                    <b-card>
                        <b-form-file
                            v-model="mutableFile"
                            ref="file-input"
                            variant="success"
                            accept=".txt"
                            required
                            @change="$emit('readFile', $event)"
                            :disabled="isGenerating"
                        ></b-form-file>
                        
                        <br>
                        
                        <div class="result-file">
                            <p>
                                Selected File: <b>{{ this.mutableFile ? this.mutableFile.name: "" }}</b>
                            </p>
                            <b-button
                                variant="outline-danger"
                                size="sm"
                                @click="$emit('clearFile')"
                                :disabled="isGenerating || !this.mutableFile"
                            >
                                Reset File
                            </b-button>
                        </div>
                        <div class="control-result">
                            <b-container>
                                <b-row>
                                    <b-col xs="auto" sm="5">
                                            <b-dropdown 
                                                text="Download.."
                                                variant="outline-success"
                                                :disabled="isGenerating || !this.mutableFile"
                                            >
                                            <b-dropdown-item-button
                                                @click="$emit('downloadPdf')"
                                            >
                                                as pdf
                                            </b-dropdown-item-button>
                                            <b-dropdown-item-button
                                                @click="$emit('downloadJSON')"
                                            >
                                                as json
                                            </b-dropdown-item-button>
                                        </b-dropdown>
                                    </b-col>
                                    <b-col xs="7" class="pt-2">
                                        <div>
                                            <b-progress>
                                                <b-progress-bar
                                                    animated
                                                    variant="success"
                                                    :max="max"
                                                    :value="this.progress" 
                                                    :label="`${(this.progress / max) * 100}%`">
                                                </b-progress-bar>
                                            </b-progress>
                                        </div>
                                    </b-col>
                                </b-row>
                            </b-container>
                        </div>
                        <b-list-group v-if="resultReader" flush>
                            <b-list-group-item></b-list-group-item>
                            <b-list-group-item class="pb-0 text-center">
                                view as:&nbsp;
                                <b-dropdown
                                    variant="success"
                                    :disabled="isGenerating || !this.mutableFile"
                                    :text="resultReader.users[0]"
                                >
                                    <span
                                        v-for="users in resultReader.users"
                                        :key="users.id"
                                    >
                                        <b-dropdown-item-button 
                                            v-if="users != resultReader.users[0]"
                                            :aria-valuetext="users" 
                                            @click="$emit('changeUser', $event)"
                                        >
                                            {{ users }}
                                        </b-dropdown-item-button>
                                    </span>
                                </b-dropdown>
                            </b-list-group-item>
                        </b-list-group>
                    </b-card>
                    
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                max: 100,
            }
        },
        computed: {
            isGenerating() {
                return this.progress !== 0 && this.progress !== 100
            },
            getFilenameExport() {
                if(this.file) {
                    return this.file.name.replace(/\.\w+/g, `-${new Date().getTime()}`)
                }
            },
            mutableFile() {
                if(this.file) {
                    return this.file
                }

                if(this.$parent.file) {
                    return this.$parent.file
                }
            }
        },
        props: ["resultReader", "file", "progress"]        
    }
</script>