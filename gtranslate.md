
Translate|X

    About Us Blog Pricing FAQ Docs 

API Documentation
About Us API Documentation Blog TranslateX on GitHub
Index

    Endpoints
        Translate
        Supported Languages
        Detect Language
    Code Examples
        PHP
        Python
        Node.js
        JavaScript
        Go
        .NET
        Ruby
        Java
        cURL

Welcome to the TranslateX API!

TranslateX API provides an easy way to integrate translations into your application.
Endpoints

The list of available endpoints to send requests.
Translate
Description

Returns a translated text. Use this endpoint to translate either plain text or HTML from one language to another.
Endpoint URL

https://api.translatex.com/translate
HTTP Method

POST
Parameters
Parameter 	Description 	Type 	Mandatory
sl 	Source language code or "auto" for source language detection 	String 	Yes
tl 	Target language code 	String 	Yes
key 	API key 	String 	Yes (required via key GET parameter or X-API-Key request header)
text 	Texts to translate 	Array[String] 	Yes (if "html" parameter is not present)
html 	HTML to translate 	String 	Yes (if "text" parameter is not present)
Response Attributes
Attribute 	Description 	Type
translation 	Translated text(s) or HTML 	Array[String] or String
detected_lang 	The detected language code, returned only if source is "auto". 	String
Response Headers
Header 	Description 	Type 	Example
X-TX-RateLimit 	Rate limit for API key 	String 	50/min
X-TX-RateLimit-Remaining 	The remaining number of requests 	Number 	49
Examples

Translate "Hello World!" from English to French.
Request

POST /translate?sl=en&tl=fr&key=AIzaTX...
body:

text=Hello%20World!
Response

{
    "translation": [
        "Bonjour le monde!"
    ]
}

Translate multiple texts to Spanish with auto-detected source language.
Request

POST /translate?sl=auto&tl=es&key=AIzaTX...
body:

text=Hello%20World!&text=How%20are%20you%3F&text=This%20is%20a%20test.
Response

{
    "translation": [
        "¡Hola Mundo!",
        "¿Cómo estás?",
        "Esto es una prueba."
    ],
    "detected_lang": "en"
}

Translate HTML from English to Spanish.
Request

POST /translate?sl=en&tl=es&key=AIzaTX...
body:

html=%3Cp%3EHello%20World!%3C%2Fp%3E%3Cp%3EThis%20is%20a%20test.%3C%2Fp%3E
Response

{
    "translation": "<p>¡Hola Mundo!<\/p><p>Esta es una prueba.<\/p>"
}

Back to top
Supported Languages
Description

Returns a list of all supported languages and their respective language codes.
Endpoint URL

https://api.translatex.com/supported-languages
HTTP Method

GET
Parameters
Parameter 	Description 	Type 	Mandatory
key 	API key 	String 	Yes (required via key GET parameter or X-API-Key request header)
Response Attributes
Attribute 	Description 	Type
languages 	List of supported languages 	Array[Object]
languages[].language 	Language code 	String
languages[].name 	Language name 	String
Response Headers
Header 	Description 	Type 	Example
X-TX-RateLimit 	Rate limit for API key 	String 	50/min
X-TX-RateLimit-Remaining 	The remaining number of requests 	Number 	49
Examples

Get a list of all supported languages.
Request

GET /supported-languages?key=AIzaTX...
Response

{
    "languages": [
        {
            "language": "en",
            "name": "English"
        },
        {
            "language": "fr",
            "name": "French"
        },
        {
            "language": "es",
            "name": "Spanish"
        }
    ]
}

Back to top
Detect Language
Description

Detects the language of the provided text or HTML.

Note: Avoid using very short phrases or single words, as they may lead to low accuracy.
Endpoint URL

https://api.translatex.com/detect
HTTP Method

POST
Parameters
Parameter 	Description 	Type 	Mandatory
key 	API key 	String 	Yes (required via key GET parameter or X-API-Key request header)
text 	Text(s) to detect language from 	Array[String] 	Yes (if "html" parameter is not present)
html 	HTML to detect language from 	String 	Yes (if "text" parameter is not present)
Response Attributes
Attribute 	Description 	Type
detections 	Detected languages 	Array[Object]
detections[].language 	Detected language code 	String
detections[].confidence 	Confidence score (0-1) 	Number
Response Headers
Header 	Description 	Type 	Example
X-TX-RateLimit 	Rate limit for API key 	String 	75/min
X-TX-RateLimit-Remaining 	The remaining number of requests 	Number 	74
Examples

Detect the language of "Bonjour".
Request

POST /detect?key=AIzaTX...
body:

text=Bonjour
Response

{
    "detections": [
        {
            "language": "fr",
            "confidence": 0.99
        }
    ]
}

Back to top
Code Examples

Below are some quick examples of how to use the TranslateX API in various programming languages.
PHP

<?php
$url = "https://api.translatex.com/translate?sl=en&tl=fr&key=API_KEY";

$data = array(
    'text' => array(
        'Hello World!',
        'This is a test.'
    )
);

$post_body = array();
foreach($data['text'] as $val)
    $post_body[] = 'text=' . rawurlencode($val);
$post_body = implode('&', $post_body);

$options = array(
    'http' => array(
        'method'  => 'POST',
        'header'  => "Content-Type: application/x-www-form-urlencoded\r\n",
        'content' => $post_body
    )
);

$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);

echo $response;

Back to top
Python

import requests
import urllib.parse

url = "https://api.translatex.com/translate?sl=en&tl=fr&key=API_KEY"

data = {
    'text': [
        'Hello World!',
        'This is a test.'
    ]
}

payload_parts = []
for val in data['text']:
    payload_parts.append('text=' + urllib.parse.quote(val))

payload = "&".join(payload_parts)

headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
}

response = requests.post(url, data=payload, headers=headers)
print(response.text)

Back to top
Node.js

const https = require('https');
const querystring = require('querystring');

const url = 'https://api.translatex.com/translate?sl=en&tl=fr&key=API_KEY';

const textData = [
    'Hello World!',
    'This is a test.'
];

const postBody = textData.map(value => 'text=' + encodeURIComponent(value)).join('&');

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postBody)
    }
};

const req = https.request(url, options, (res) => {
    let responseData = '';

    res.on('data', (chunk) => {
        responseData += chunk;
    });

    res.on('end', () => {
        console.log(responseData);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(postBody);
req.end();

Back to top
JavaScript

This Translation API does not allow cross-domain requests and will not set the Access-Control-Allow-Origin header. Therefore, we strongly advise against using front-end JavaScript code to call this API directly, as it will expose your secret API key.

Instead, please route requests through a trusted environment such as your own back-end script or a proxy configured on your server.
For example, with NGINX:

location /translate {
    proxy_pass        https://api.translatex.com;
    proxy_set_header  X-Real-IP        $remote_addr;
    proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
    proxy_set_header  X-API-Key        "API_KEY";

    client_max_body_size 2M;
    proxy_read_timeout 120s;
}

Then, from your front-end code, simply call the /translate endpoint on your own server without exposing an API key:

fetch('/translate?sl=en&tl=fr', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'text=' + encodeURIComponent('Hello World!')
})
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error(error));

This approach ensures your key remains safe on your server and that cross-origin restrictions do not interfere with your requests.

Back to top
Go

package main

import (
    "fmt"
    "io/ioutil"
    "net/http"
    "net/url"
    "strings"
)

func main() {
    apiURL := "https://api.translatex.com/translate?sl=en&tl=fr&key=API_KEY"

    texts := []string{
        "Hello World!",
        "This is a test.",
    }

    formData := url.Values{}
    for _, txt := range texts {
        formData.Add("text", txt)
    }
    encodedFormData := formData.Encode()

    req, err := http.NewRequest("POST", apiURL, strings.NewReader(encodedFormData))
    if err != nil {
        panic(err)
    }

    req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        panic(err)
    }

    fmt.Println(string(body))
}

Back to top
.NET

using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace TranslationExample
{
    class Program
    {
        static async Task Main(string[] args)
        {
            var url = "https://api.translatex.com/translate?sl=en&tl=fr&key=API_KEY";
            
            var textsToTranslate = new []
            {
                "Hello World!",
                "This is a test."
            };

            using (HttpClient client = new HttpClient())
            {
                var postData = new List<KeyValuePair<string, string>>();
                foreach (var text in textsToTranslate)
                {
                    postData.Add(new KeyValuePair<string, string>("text", text));
                }

                var content = new FormUrlEncodedContent(postData);

                try
                {
                    HttpResponseMessage response = await client.PostAsync(url, content);

                    string responseString = await response.Content.ReadAsStringAsync();

                    Console.WriteLine(responseString);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("An error occurred while sending the request:");
                    Console.WriteLine(ex.Message);
                }
            }

            Console.WriteLine("Press any key to exit...");
            Console.ReadKey();
        }
    }
}

Back to top
Ruby

require 'net/http'
require 'uri'

url = "https://api.translatex.com/translate?sl=en&tl=fr&key=API_KEY"
texts = [
   'Hello World!',
   'This is a test.'
]

post_body = texts.map { |txt| "text=" + URI.encode_www_form_component(txt) }.join('&')

uri = URI.parse(url)
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true if uri.scheme == "https"

request = Net::HTTP::Post.new(uri.request_uri)
request["Content-Type"] = "application/x-www-form-urlencoded"
request.body = post_body

response = http.request(request)
puts response.body

Back to top
Java

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

public class TranslateExample {
    public static void main(String[] args) {
        try {
            String apiUrl = "https://api.translatex.com/translate?sl=en&tl=fr&key=API_KEY";

            List<String> texts = Arrays.asList(
                "Hello World!",
                "This is a test."
            );

            StringBuilder postBody = new StringBuilder();
            for (String text : texts) {
                if (postBody.length() > 0) {
                    postBody.append("&");
                }
                postBody.append("text=").append(URLEncoder.encode(text, StandardCharsets.UTF_8.toString()));
            }

            URL url = new URL(apiUrl);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();

            con.setRequestMethod("POST");
            con.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            con.setDoOutput(true);

            try (DataOutputStream out = new DataOutputStream(con.getOutputStream())) {
                out.writeBytes(postBody.toString());
                out.flush();
            }

            int responseCode = con.getResponseCode();
            BufferedReader in;
            if (responseCode >= 200 && responseCode < 300) {
                in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            } else {
                in = new BufferedReader(new InputStreamReader(con.getErrorStream()));
            }

            String line;
            StringBuilder response = new StringBuilder();
            while ((line = in.readLine()) != null) {
                response.append(line);
            }
            in.close();

            System.out.println("Response Code: " + responseCode);
            System.out.println("Response: " + response.toString());

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

Back to top
cURL

curl -X POST -d "text=Hello World!" "https://api.translatex.com/translate?sl=en&tl=fr&key=API_KEY"

Back to top
Get your free translation API key today

© 2020 - 2026 GTranslate Inc. All Rights Reserved.
Terms of Service| Privacy Policy| Sitemap| Contact Us
