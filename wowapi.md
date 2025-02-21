client id

d54dd6ed3ec040f581b63d0a58f2ea66

client secret

zlsyM16T2WAr0dcZ75tgeCL4bEc0VBPx


auth:

curl -u d54dd6ed3ec040f581b63d0a58f2ea66:zlsyM16T2WAr0dcZ75tgeCL4bEc0VBPx -d "grant_type=client_credentials" https://oauth.battle.net/token

find char info:

note: USoo3taXkbZZx2Gxe7xbm1tSmDZDxKPBBK is the access token

http:
GET https://us.api.blizzard.com/profile/wow/character/lightbringer/kbye?namespace=profile-us&locale=en_US&access_token=USoo3taXkbZZx2Gxe7xbm1tSmDZDxKPBBK

curl:

curl -H "Authorization: Bearer USoo3taXkbZZx2Gxe7xbm1tSmDZDxKPBBK" "https://us.api.blizzard.com/profile/wow/character/lightbringer/kbyte?namespace=profile-us&locale=en_US"



Equipment:

curl -H "Authorization: Bearer USoo3taXkbZZx2Gxe7xbm1tSmDZDxKPBBK" "https://us.api.blizzard.com/profile/wow/character/lightbringer/kbyte/equipment?namespace=profile-us&locale=en_US" -o kbyte-equipment.json

Currency:

curl -H "Authorization: Bearer USoo3taXkbZZx2Gxe7xbm1tSmDZDxKPBBK" "https://us.api.blizzard.com/profile/wow/character/lightbringer/kbyte/collections/currencies?namespace=profile-us&locale=en_US" -o kbyte-currencies.json