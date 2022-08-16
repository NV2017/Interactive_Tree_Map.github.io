let movieURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

let movieData;

const screenScale = 0.5;
const width = window.screen.width*screenScale;
const height = window.screen.height*screenScale;
const padding = height*0.2;

let makeSVG = () => {
  d3.select('#container')
    .insert('svg')
    .attr("width",width)
    .attr("height",height)
    .attr("id","canvas");
}

// let makeSVGlegend = () => {
//   d3.select('#container')
//     .insert('svg')
//     .attr("id","legend")
//     .insert('g')
//
//   d3.select('#container')
//     .select('#legend')
//     .select('g')
//     .insert('rect')
// }

let drawTreeMap = (movieData,canvas) => {
  let hierarchy = d3.hierarchy(movieData,(node) => {
    return node['children'];
  }).sum((node) => { // Tells which field to look in to generate area
    return node['value'];
  }).sort((node1,node2) => { // Sorting by bigger revenue first
    return node2['value'] - node1['value'];
  })

  let createTreeMap = d3.treemap()
                        .size([width,height]);

  createTreeMap(hierarchy);

  let movieTiles = hierarchy.leaves();
  // console.log(movieTiles);

  let block = canvas.selectAll('g')
                    .data(movieTiles)
                    .enter()
                    .append('g')
                    .attr("transform",(movie) => {
                      return "translate("+movie['x0']+","+ movie['y0']+")";
                    })

  let tooltip_div = d3.select("#container")
        							.append("div")
        							.attr("class", "tooltip")
        							.attr("id", "tooltip")
        							.style("opacity", 0);

  block.append('rect')
       .attr("class","tile")
       .attr("fill", (movie) => {
          let category = movie['data']['category'];
          if(category === 'Action'){
              return 'orange'
          }else if(category === 'Drama'){
              return 'lightgreen'
          }else if(category === 'Adventure'){
              return 'crimson'
          }else if(category === 'Family'){
              return 'steelblue'
          }else if(category === 'Animation'){
              return 'pink'
          }else if(category === 'Comedy'){
              return 'khaki'
          }else if(category === 'Biography'){
              return 'tan'
          }
       })
       .attr('data-name', (movie) => {
            return movie['data']['name'];
        })
        .attr('data-category', (movie) => {
            return movie['data']['category'];
        })
        .attr('data-value', (movie) => {
            return movie['data']['value'];
        })
        .attr("width",(movie)=>{
          return movie['x1']-movie['x0'];
        }).attr("height",(movie)=>{
          return movie['y1']-movie['y0'];
        })
        .on("mouseover", (movieDataItem) => {
          // console.log(movieDataItem.data);

          let tempCategory = movieDataItem.data.category;
          let tempName = movieDataItem.data.name;
          let tempValue = movieDataItem.data.value;

          tooltip_div.transition()
                     .duration(100)
                     .style("opacity", 0.5);

          let revenue = movieDataItem['data']['value'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

          tooltip_div.html('$ ' + revenue + '<hr />' + movieDataItem['data']['name'])
                     .style("left", (movieDataItem['x0']-10) + "px")
                     .style("top", (movieDataItem['y0']-10) + "px");
          tooltip_div.attr('data-value', movieDataItem['data']['value']);


          // tooltip_div.html("<span class='data-value'>" + "Revenue: $" + revenue + "</span><br>" +
          //     // "<span class='data-value'>" + "Value: $" + tempValue + "</span><br>" +
          //     "<span class='data-category'>Category: " + tempCategory + "</span><br>"+
          //     "<span class='data-name'>Name: " + tempName + "</span>")
          //   // .style("left", (d3.event.pageX - ($('.tooltip').width())) + "px")
          //   .style("left", (movieDataItem['x0']-10) + "px")
          //   // .style("top", (d3.event.pageY - 70) + "px");
          //   .style("top", (movieDataItem['y0']-10) + "px");
          // tooltip_div.attr("id","tooltip");
        })
        .on("mouseout", (movieDataItem) => {
          tooltip_div.transition()
            .duration(200)
            .style("opacity", 0);
        });

  block.append('text')
       .text((movie)=>movie['data']['name'])
       .attr("x","1rem")
       .attr("y","2rem")
       .attr("font-size","0.7rem")
       .attr("text-align","center")
       .attr("word-wrap","break-word")
}

d3.json(movieURL).then(
  (data, error) => {
    if(error){
      console.log("Movie data obtaining error: " + error);
    }else{
      movieData = data;
      // console.log("Received movie data: "+movieData);

      makeSVG();

      let canvas = d3.select('#canvas')
      // let svg_element =   d3.select("svg");

      drawTreeMap(movieData,canvas);

      // makeSVGlegend();
    }
  }
)
