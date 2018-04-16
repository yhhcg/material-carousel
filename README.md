## material-carousel

The component does not depend on any projects.

#### Config Options
|Name|Type|Default|Required|Description|
|:--:|:--:|:-----:|:--:|:----------|
|classes|Object| |N|Useful to extend the style applied to components|
|data|Array|[]|Y|Data|
|data.url|String||Y|Image url|
|direction|String|'rtl'|N|Roll direction|
|isAutoPlay|Boolean|true|N|Whether to play automatically|
|interval|Number|4000|N|Delay between roll (in ms)|
|onClick|Function||N|Gives two arguments. Clicked image data and clicked image index |

#### CSS API
You can override all the class names injected by Material-carousel thanks to the classes property. This property accepts the following keys:
- root
- carouselGroup
- carouselItem
- dots
- dot
- active