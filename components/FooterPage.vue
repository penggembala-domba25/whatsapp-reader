<template>
    <div class="footer py-3 px-2 bg-success">
        <b-container fluid>
            <b-row>
                <b-col sm="4" md="6"></b-col>
                <b-col 
                    xs="auto" class="text-right"
                >
                    <p class="m-0">
                        &copy;{{
                            new Date().getFullYear() == '2021' ? 
                            new Date().getFullYear() : 
                            `2021 - ${new Date().getFullYear()}`
                        }} <a href="https://github.com/penggembala-domba25/whatsapp-reader.git">
                            penggembala-domba25
                        </a> 
                    </p>
                </b-col>
            </b-row>
        </b-container >
    </div>
</template>