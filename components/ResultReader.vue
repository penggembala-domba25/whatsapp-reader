<template>
    <div
        v-if="resultReader"
        id="result-reader"
    >
        <b-container fluid>
            <b-row align-h="center">
                <b-col
                    lg="6"
                    md="8"
                    sm="10"
                >
                    <div class="status-bar">
                        <b-container fluid>
                            <b-row>
                                <b-col>
                                    <b-avatar variant="success"></b-avatar>
                                    &nbsp;
                                    <span class="name">
                                        {{resultReader.users[1]}}
                                    </span>
                                </b-col>
                            </b-row>
                        </b-container>
                    </div>
                    <div class="conversation">
                        <ul>
                            <li
                                v-for="information in resultReader.informations"
                                :key="information.id"
                                class="info"
                            >
                                {{ information.desc }}
                            </li>
                        </ul>
                        <ul
                            v-for="chats in resultReader.chats"
                            :key="chats.id"
                        >
                            <span 
                                class="chat"
                                v-for="(user_chat_topic, username) in chats" 
                                :key="user_chat_topic.id"
                            >
                                <span
                                    v-for="chat_user in user_chat_topic" 
                                    :key="chat_user.id"
                                >
                                    <li :class="[username == resultReader.users[0] ? 'sent-chat' : 'received-chat']">
                                        {{ chat_user.chat }}
                                        <span 
                                            class="chat-time"
                                        >
                                            <span class="tick">
                                                &#x2713;&#x2713;
                                            </span>
                                            &nbsp;
                                            {{ chat_user.time.replace(/[\d{1,2}\/]+,\s/g, "") }}
                                        </span>
                                    </li>
                                </span>
                            </span>
                        </ul>
                    </div>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
    export default {
        props: {
            resultReader: {
                type: Object,
                default: null
            }
        }
    }
</script>