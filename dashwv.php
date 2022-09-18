<?php

$userId = "USER_ID";

// getcertificate
$serviceCertificate = file_get_contents("https://widevine-claroglobal-vod.clarovideo.net/licenser/getcertificate");
$certificate64 = base64_encode($serviceCertificate);
// echo $certificate64;

// Service Request for token + material_id 
$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://mfwkweb-api.clarovideo.net/services/player/getmedia?crDomain=https://www.clarovideo.com&device_id=693e9af84d3dfcc71e640e005bdc5e2e&device_category=web&device_model=web&device_type=web&device_so=Chrome&format=json&device_manufacturer=generic&authpn=webclient&authpt=tfg1h3j4k6fd7&api_version=v5.93&region=mexico&HKS=web6309433c03854&content_id=781461&user_hash=Njk4NDY2MTB8MTY2MzUxNjU5MHw4YzBiOTg5NDRjYzA1NDExZGI2YmMwNTRhMzU5MjkyNGFiYTkyNWY2YTM5ZGUxYTYzNw%253D%253D&group_id=771505&stream_type=dashwv&preview=0&css=0&startTime=16635132000000000&user_id='.$userId,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS => array('user_token' => 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NjM1MTYyODgsImV4cCI6MTY2ODcwMDU4OCwidXNyIjp7InVzZXJfaWQiOiI2OTg0NjYxMCIsInVzZXJfdHlwZSI6IkNNWE5PVklQIiwidXNlcm5hbWUiOiJyb3NpY292YXJyOEBnbWFpbC5jb20iLCJlbWFpbCI6InJvc2ljb3ZhcnI4QGdtYWlsLmNvbSIsImZpcnN0bmFtZSI6IlJPQ0lPRE9MT1JFUyIsImxhc3RuYW1lIjoiSEVSRURJQSIsImNvdW50cnlfY29kZSI6Ik1YIiwicmVnaW9uIjoibWV4aWNvIiwiYWNjZXB0ZWRfdGVybXMiOjEsImdhbWlmaWNhdGlvbl9pZCI6IjYyZWQ3YWU3MzA1NjMyMjc3YTE3NGZjNyIsInBhcmVudF9pZCI6IjY5ODQ2NjEwIiwiYWNjb3VudCI6IjE5MzAxNTMzODkiLCJhZG1pbiI6dHJ1ZX19.5ll60QzTRHbZoScKTbY-zh9dTKib_5PvYZnlYyDTFeQ',
                            'payway_token' => 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NjYxMDg1OTEsImlzcyI6InBheXdheVwvbGluZWFsY2hhbm5lbHMiLCJwZ3MiOnsidXNlciI6IjY5ODQ2NjEwIiwicGFyZW50IjoiNjk4NDY2MTAiLCJvZmZlciI6IjE0MzI4NzY0IiwicHVyY2hhc2UiOm51bGwsInBsYXkiOnsiZW5hYmxlZCI6dHJ1ZSwiZGV2aWNlcyI6NSwic3RyZWFtcyI6NX0sImRsIjp7ImVuYWJsZWQiOm51bGwsImRldmljZXMiOm51bGwsImV4cCI6bnVsbH0sIm5wdnIiOnsic3RvcmFnZSI6IjAiLCJ0aW1lc2hpZnQiOiIwIn0sIm9iamVjdCI6IjQwODAiLCJncm91cHMiOlsiNzgwNTIyIiwiNzgwNTA3IiwiNzgwNTA2IiwiNzcxNTA1Il19fQ.15P9V1SwJv0CPP9PaXhqt-jjzYUr1UWysNOUtpZ0gfE'),
  CURLOPT_HTTPHEADER => array(
    'Accept: application/json, text/plain, */*',
    'Accept-Language: es-US,es;q=0.9,en-US;q=0.8,en;q=0.7,es-419;q=0.6,fr;q=0.5',
    'Connection: keep-alive',
    'DNT: 1',
    'Origin: https://www.clarovideo.com',
    'Referer: https://www.clarovideo.com/',
    'Sec-Fetch-Dest: empty',
    'Sec-Fetch-Mode: cors',
    'Sec-Fetch-Site: cross-site',
    'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
    'sec-ch-ua: "Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
    'sec-ch-ua-mobile: ?0',
    'sec-ch-ua-platform: "Linux"',
  ),
));

$response = curl_exec($curl);

curl_close($curl);

$responseData = json_decode($response, TRUE);

// Getting response token & material_id
$responseChallenge = json_decode($responseData['response']['media']['challenge'], TRUE);
$responseToken = $responseChallenge['token'];
$responseMaterialId = $responseChallenge['material_id'];

// echo $responseData['response']['media']['challenge'];
// echo $responseToken;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://widevine-claroglobal-vod.clarovideo.net/licenser/getlicense?user_id='.$userId,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS =>'{"token":"'.$responseToken.'","device_id":"693e9af84d3dfcc71e640e005bdc5e2e","widevineBody":"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"}',
//   CURLOPT_POSTFIELDS =>'{"token":"fca9dd100754be38435e2fa321f10719","device_id":"693e9af84d3dfcc71e640e005bdc5e2e","widevineBody":"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"}',
//   CURLOPT_POSTFIELDS =>'{"token":"'.$responseToken.'","device_id":"693e9af84d3dfcc71e640e005bdc5e2e","widevineBody":"'.$certificate64.'"}',
//   CURLOPT_POSTFIELDS => array('token' => $responseToken,
//                               'device_id' => '693e9af84d3dfcc71e640e005bdc5e2e',
//                               'widevineBody' => $certificate64
//                             ),

  CURLOPT_HTTPHEADER => array(
    'Accept: */*',
    'Accept-Language: es-US,es;q=0.9,en-US;q=0.8,en;q=0.7,es-419;q=0.6,fr;q=0.5',
    'Connection: keep-alive',
    'DNT: 1',
    'Origin: https://www.clarovideo.com',
    'Referer: https://www.clarovideo.com/',
    'Sec-Fetch-Dest: empty',
    'Sec-Fetch-Mode: cors',
    'Sec-Fetch-Site: cross-site',
    'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36',
    'sec-ch-ua: "Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
    'sec-ch-ua-mobile: ?0',
    'sec-ch-ua-platform: "Linux"',
    'Content-Type: text/plain'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;