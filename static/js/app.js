//Global variables
var user_option='Null';
var local_data;
var names;
var metadata;
var samples;
var menu;

//////////////////////////////////////////////
//read the data file in the local directory ////
//run the python http server to read it//////
////////////////////////////////////////////////
d3.json("samples.json").then (data =>{ 
    //console.log(data)    
    local_data = data;
    names = local_data.names;
    metadata = local_data.metadata;
    samples = local_data.samples;
    menu = d3.select("#selDataset");
    
   //create initial plots when the page is loading
    read_init();

    //create the dropdown menu to select test subjects
    addSubjects(names);

    //read the data sample to retieve information about the user selected test subject
    read_sample(menu,user_option);

    });

////////////////////////////////////////////
//function to read and create initial plots
////////////////////////////////////////////
function read_init(){
    id = '940'
    
    otu_ids = (samples[0].otu_ids.slice(0,10).reverse());
    otu_labels = samples[0].otu_labels.slice(0,10).reverse();
    sample_values = samples[0].sample_values.slice(0,10).reverse();
    new_otu_ids = otu_ids.map(i => 'OTU ID ' + i);
     // bar chart
     var trace = {
        x:sample_values,
        y:new_otu_ids,
        text: otu_labels.map(String),
        type: 'bar',
        orientation: "h"
       // width: [100,100,100,100,100,100,100,100,100,100]
    }
    data = [trace];

    var layout ={
        title: 'Top 10 OTUs',
        xaxis: {
            tickangle: -45,
            title: "Sample Value"
            
          },
        yaxis: {
            gridwidth: 2,
            title: "OTU ID"
          },
        bargap :0.5,
        margin: {
            l: 100,
            r: 100,
            t: 50,
            b: 100
        },
        paper_bgcolor: "#EEEEEE"
    }
    //#var CHART = d3.selectAll("#bar").node();
    Plotly.newPlot('bar',data,layout);

    //Bubble chart
    var trace1 = {
        x:samples[0].otu_ids,
        y: samples[0].sample_values,
        text: samples[0].otu_labels.map(String),
        mode: 'markers',
        marker:{
            size: samples[0].sample_values,
            color: samples[0].otu_ids
        }

    }
    data1 = [trace1];
    var layout ={
        title: 'Sample Values in a bubble chart',
        xaxis: {
            title: 'OTU IDs'
        }
    }

    Plotly.newPlot('bubble', data1, layout);
    document.getElementById("sample-metadata").innerHTML= "<p>"+ "ID: "+ metadata[0].id  +
        "<br>" + "ETHNICITY: "+ metadata[0].ethnicity  +
        "<br>" + "GENDER: "+ metadata[0].gender +
        "<br>" +  "AGE: "+ metadata[0].age  + 
        "<br>" + "LOCATION: "+ metadata[0].location + 
        "<br>" + "BBTYPE: "+ metadata[0].bbtype + 
        "<br>" + "WFREQ: "+ metadata[0].wfreq +  "</p>" ;    


    //Guage Chart

    var trace2 = {
        type: 'pie',
        showlegend: false,
        hole: 0.6,
        rotation: 90,
        values: [ 9, 9, 9, 9, 9, 9, 9, 9, 9, 81],
        text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
        direction: 'clockwise',
        textinfo: 'text',
        textposition: 'inside',
        marker: {
          colors: ['#EBDEF0','#D7BDE2','#C39BD3','#AF7AC5','#9B59B6','#7D3C98','#6C3483','#512E5F','#4A235A','#EEEEEE'],
          labels: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
          hoverinfo: ''
        },
        
      }
  
     //Indicator object
      var angle = Math.PI- (Math.PI*metadata[0].wfreq/9);
      var x= 0.5+0.35*Math.cos(angle);
      var y= 0.5+0.35*Math.sin(angle);
      var Path = "M .45 .5 L .55 .5 L"+ " " + x.toString() +" " + y.toString() + "Z";

      var layout = {
        shapes: [        
            {
              type: 'path',
              path:Path ,
              fillcolor: 'red',
              line: {
                color: 'red'
              }
            }],

        title: 'No. of Scrubs per Week',
        xaxis: {visible: false, range: [-1, 1]},
        yaxis: {visible: false, range: [-1, 1]},
        paper_bgcolor: "#EEEEEE"
        
      }
  
      var data2 = [trace2];
      Plotly.newPlot('gauge', data2, layout);

}

///////////////////////////////////////////////////////
//function to  create the dropdown mwnu
///////////////////////////////////////////
function addSubjects(names_list){
    var size = names_list.length;
    var html_code ;
    //console.log(size);
    for (i=0; i<size; i++){
     //document.getElementById("selDataset").innerHTML= "<option value='dataset1'>"+
     //names_list[i] + "</option>";
     html_code = html_code+"<option value=" + names_list[i] + ">"+ names_list[i] + "</option>";
    }
    document.getElementById("selDataset").innerHTML=html_code;
}

/////////////////////////////////////
//function to listen to the user input
////////////////////////////////////
function read_sample(menu,user_option){

    menu.on("change",read_userinput);
    menu.on("click",read_userinput);
    //console.log(user_option);

}

////////////////////////////////////
//read user input and update plots//
//////////////////////////////////////
function read_userinput(){
    
    d3.event.preventDefault();
    var menu1 = document.getElementById("selDataset");
    var temp = menu1.options[menu1.selectedIndex].text;   
    user_option = temp; 
    var otu_ids;
    var otu_labels;
    var sample_values;

    //console.log(samples);
    var temp;
    for (i=0; i<samples.length; i++){
        if (samples[i].id==user_option){
            otu_ids = (samples[i].otu_ids.slice(0,10).reverse());
            otu_labels = samples[i].otu_labels.slice(0,10).reverse();
            sample_values = samples[i].sample_values.slice(0,10).reverse();
            new_otu_ids = otu_ids.map(i => 'OTU ID ' + i);


            // bar chart
            

            var trace = {
                x:sample_values,
                y:new_otu_ids,
                text: otu_labels.map(String),
                type: 'bar',
                orientation: "h"
               // width: [100,100,100,100,100,100,100,100,100,100]
            }
            data = [trace];

            var layout ={
                title: 'Top 10 OTUs',
                xaxis: {
                    tickangle: -45,
                    title: "Sample Value"
                    
                  },
                yaxis: {
                    gridwidth: 2,
                    title: "OTU ID"
                  },
                bargap :0.5,
                margin: {
                    l: 100,
                    r: 100,
                    t: 50,
                    b: 100
                },
                paper_bgcolor: "#EEEEEE"

            }
            //#var CHART = d3.selectAll("#bar").node();
            Plotly.newPlot('bar',data,layout);

            //Bubble chart
            var trace1 = {
                x:samples[i].otu_ids,
                y:samples[i].sample_values,
                text: samples[i].otu_labels.map(String),
                mode: 'markers',
                marker:{
                    size: samples[i].sample_values,
                    color: samples[i].otu_ids
                }
        
            }
            data = [trace1];
            var layout ={
                title: 'Sample Values in a bubble chart',
                xaxis: {
                    title: 'OTU IDs'
                }
            }

            Plotly.newPlot('bubble', data, layout);

            //Update demographic information
            if (metadata[i].id==user_option){
                document.getElementById("sample-metadata").innerHTML= "<p>"+ "ID: "+ metadata[i].id  +
                "<br>" +   "ETHNICITY: "+ metadata[i].ethnicity  +
                "<br>" + "GENDER: "+ metadata[i].gender +
                "<br>" + "AGE: "+ metadata[i].age + 
                "<br>" + "LOCATION: "+ metadata[i].location + 
                "<br>" + "BBTYPE: "+ metadata[i].bbtype + 
                "<br>" + "WFREQ: "+ metadata[i].wfreq +  "</p>"   
            }
            
            //Gauge chart
            var trace2 = {
                type: 'pie',
                showlegend: false,
                hole: 0.6,
                rotation: 90,
                values: [ 9, 9, 9, 9, 9, 9, 9, 9, 9, 81],
                text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
                direction: 'clockwise',
                textinfo: 'text',
                textposition: 'inside',
                marker: {
                  colors: ['#EBDEF0','#D7BDE2','#C39BD3','#AF7AC5','#9B59B6','#7D3C98','#6C3483','#512E5F','#4A235A','#EEEEEE'],
                  labels: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
                  hoverinfo: ''
                }
            }
          
            //Indicator object
            var angle = Math.PI- (Math.PI*metadata[i].wfreq/9);
            
            var x= 0.5+0.35*Math.cos(angle);
            var y= 0.5+0.35*Math.sin(angle);
            //console.log(metadata[i].wfreq);
            //console.log(angle*180/3.14);

            var Path = "M .45 .5 L .55 .5 L"+ " " + x.toString() +" " + y.toString() + "Z";
        
            var layout = {
                shapes: [        
                    {
                      type: 'path',
                      path:Path ,
                      fillcolor: 'red',
                      line: {
                        color: 'red'
                      }
                    }],
        
            title: 'No. of Scrubs per Week',
            xaxis: {visible: false, range: [-1, 1]},
            yaxis: {visible: false, range: [-1, 1]},
            paper_bgcolor: "#EEEEEE"
              }
          
            var data2 = [trace2];
            Plotly.newPlot('gauge', data2, layout);
        }
    }

}
//////////////////////////End/////////////////////////
