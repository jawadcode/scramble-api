# scramble-api
A REST API wrapper around Owstin/scrambow
## Setup
`npm install`
`npm start`
## How to use:
#### Scrambles without images
To get a scramble of all wca events minus clock without any scramble images:
`GET /:puzzle/:numofscrambles`
The the possible values of the puzzle parameter are: 
'skewb',
'pyra',
'mega',
'sq1',
'222',
'333',
'444',
'555',
'666' and
'777'
#### Scrambles with images
`GET /withimg/:puzzle/:numofscrambles`
The possible values of the puzzle parameter are:
'2',
'3',
'4',
'5',
'6' and
'7'
Note: The images returned are base-64 data-url pngs of the RUF and BLD faces
##### This project would have been impossible without @Owstin's scrambow and Conrad Rider's VisualCube
###### Made at 5am, I'm going to sleep now, bye 👋
