function convert_to_json(file) {
    const regex_get_time = /[\d{1,2}\/]+,\s[\d{1,2}:]+[\w{2}\s]+/gim;
    const regex_get_user = /-\s[\w\s]+:\s/g;

    let id = 1;

    let result_json = new Object;
    let chat_topic = new Object;

    let result_splitted_file = split_with(file, regex_get_time, true)

    let chat_time = match_with(file, regex_get_time, [/\s$/g], [""])

    for (let i = 0; i < result_splitted_file.length; i++) {
        if (result_splitted_file[i].search(regex_get_user) != 0) {
            if (!result_json.hasOwnProperty("informations")) {
                result_json["informations"] = []
            }

            result_json.informations.push({
                "desc": replace_with(result_splitted_file[i], /-\s/g, ""),
                "time": chat_time[i],
                "id": id
            })

            id++
        } else {
            let user = match_with(result_splitted_file[i], regex_get_user).toString()
            user = replace_with(user, [/:\s/g, /-\s/g], ["", ""])

            if (!result_json.hasOwnProperty("users")) {
                result_json["users"] = []
            }

            if (!result_json["users"].includes(user)) {
                result_json.users.push(user)
            }

            if (!result_json.hasOwnProperty("chats")) {
                result_json["chats"] = []
            }

            if (chat_topic.hasOwnProperty(user)) {
                if (result_splitted_file[i - 1]) {
                    let prev_user = match_with(result_splitted_file[i - 1], regex_get_user).toString()
                    prev_user = replace_with(prev_user, [/:\s/g, /-\s/g], ["", ""])

                    if (prev_user !== user) {
                        result_json["chats"].push(chat_topic)

                        chat_topic = new Object
                    }
                }
            }

            if (!chat_topic.hasOwnProperty(user)) {
                chat_topic[user] = []
            }

            chat_topic[user].push({
                "chat": replace_with(result_splitted_file[i], regex_get_user, ""),
                "time": chat_time[i],
                "id": id
            })

            id++
        }
    }

    return result_json
}

function split_with(text, regex, is_shifted = false) {
    let result = text.split(regex)

    if (is_shifted) {
        result.shift()
    }

    return result
}

function match_with(text, regex, replacing_regex = [], replacing_to = [], is_unique = false) {
    let result = text.match(regex)

    if (is_unique) {
        result = [...new Set(result)]
    }

    for (let i = 0; i < result.length; i++) {
        result[i] = replace_with(result[i], replacing_regex, replacing_to)
    }

    return result
}

function replace_with(text, replacing_regex = [], replacing_to = []) {
    if (replacing_regex.length > 0 && replacing_regex.length == replacing_to.length) {
        for (let i = 0; i < replacing_regex.length; i++) {
            text = text.replace(replacing_regex[i], replacing_to[i])
        }
    } else {
        text = text.replace(replacing_regex, replacing_to)
    }

    return text
}

export default convert_to_json