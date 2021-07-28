import React, {useState, useEffect} from 'react'
import Diagram, { createSchema, useSchema } from 'beautiful-react-diagrams';
import { Button } from 'react-bootstrap';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {Carousel} from "react-responsive-carousel";
import './Plan.css';
import api from "../../api/connect";
import axios from "axios";
import CancelIcon from '@material-ui/icons/Cancel';
import {BounceLoader} from 'react-spinners'

const initialSchema = createSchema({
  nodes: []
});

const baseURL = "http://35.239.102.202:5050";
// const imgURL = ["img/one.jpeg"]
const imgURL= [`${baseURL}/generated/plan1.png`,`${baseURL}/generated/plan2.png`,`${baseURL}/generated/plan3.png`,`${baseURL}/generated/plan4.png`,`${baseURL}/generated/plan5.png`,`${baseURL}/generated/plan6.png`,`${baseURL}/generated/plan7.png`]
const NodeStyleComponent = (props) =>{
  
  return(
    <div className="node_style" style={{backgroundColor:`${props.color}`, width:`${props.width}`, height:`${props.height}`, borderRadius: "10px", display: "flex", alignItems: "center",     justifyContent: "center",     textAlign: "center"}}>
      <div style={{textAlign: 'right'}}>
      <CancelIcon fontSize ="small" onClick={() => props.data.onClick(props.id)} style = {{position: 'absolute',backgroundColor:"white", color: 'red',right:'-6px', top: '-7px', cursor: 'default', borderRadius:"50px", margin:"0px"}}/>
      </div>
      <div role="button" style={{ postion:"relative", padding: '0px', textAlign: 'center', fontWeight:"bold", color: "black", fontFamily:"poppins", marginLeft: "30px"}}>
          {props.content}
      </div>
      <div>       
          {props.inputs.map((port) => React.cloneElement(port, {style: {  width: '30px', height: `${props.height}`, background: '#1B263B', opacity: "0.0", borderRadius:"10px", position:"relative", right:`${props.port1right}`, top:`${props.port1top}`}}))}
          {props.outputs.map((port) => React.cloneElement(port, {style: { width: '30px', height: `${props.height}`, background: '#1B263B', opacity: "0.0", borderRadius:"10px", position:"relative", right:`${props.port2right}`, top:`${props.port2top}`}}))}
      </div>
      <br></br>
      {/* <div className = ".form">
        <form>
          <input text="text" placeholder="Area(m2)" name='area' style={{width:'50px'}}/>
        </form>
      </div> */}
    </div>
  );
}
// const areaInput = () => {
//   console.log("areainput");
//   return(
//     <div className = ".form">
//       <h1>Area Form</h1>
//       <form>
//         <input text="text" placeholder="Area in m2" name='area'/>
//       </form>
//     </div>
//   )
// }


const CustomRender = ({ id, content, data, inputs, outputs}) => {
    // console.log(content);
    // areaInput();
    if (content === "bedroom") {

      return <NodeStyleComponent id={id} content={content} data={data} inputs={inputs} outputs={outputs} color="rgb(255, 165, 0)" width="90px" height="100px" port1right="90px" port1top="50px" port2right="5px" port2top="-45px"/>;
    }
    else if (content === "bathroom") {
      
      return <NodeStyleComponent id={id} content={content} data={data} inputs={inputs} outputs={outputs} color="rgb(128, 128, 128)" width="88px" height="45px" port1right="80px" port1top="22px" port2right="15px" port2top="-18px"/>;
    }
    else if (content === "living") {
      
      return <NodeStyleComponent id={id} content={content} data={data} inputs={inputs} outputs={outputs} color="rgb(165, 42, 42)" width="90px" height="100px" port1right="75px" port1top="50px" port2right="-5px" port2top="-45px"/>;
    }
    else if (content === "kitchen") {
      
      return <NodeStyleComponent id={id} content={content} data={data} inputs={inputs} outputs={outputs} color="rgb(255, 0, 255)" width="80px" height="75px" port1right="80px" port1top="37px" port2right="5px" port2top="-33px"/>;
    }
    else if (content === "closet") {
      
      return <NodeStyleComponent id={id} content={content} data={data} inputs={inputs} outputs={outputs} color="rgb(255, 0, 0)" width="80px" height="45px" port1right="75px" port1top="22px" port2right="0px" port2top="-18px"/>;
    }
    else if (content === "balcony") {
      
      return <NodeStyleComponent id={id} content={content} data={data} inputs={inputs} outputs={outputs} color="rgb(0, 0, 255)" width="80px" height="45px" port1right="80px" port1top="22px" port2right="8px" port2top="-18px"/>;
    }
    else if (content === "corridor") {
      
      return <NodeStyleComponent id={id} content={content} data={data} inputs={inputs} outputs={outputs} color="rgb(0, 255, 255)" width="80px" height="45px"  port1right="80px" port1top="22px" port2right="8px" port2top="-18px"/>;
    }
    else if (content === "dining") {
      
      return <NodeStyleComponent id={id} content={content} data={data} inputs={inputs} outputs={outputs} color="rgb(0, 128, 0)" width="80px" height="75px"  port1right="80px" port1top="37px" port2right="0px" port2top="-33px"/>;
    }
    else
    {
      
      return <NodeStyleComponent id={id} content={content} data={data} inputs={inputs} outputs={outputs} color="rgb(255, 255, 0)" width="80px" height="75px"  port1right="80px" port1top="37px" port2right="5px" port2top="-33px"/>;
    }
};

const Plan = () => {
  // create diagrams schema

  
  const [schema, { onChange, addNode, removeNode }] = useSchema(initialSchema);
  const [editState, setEditState] = useState((true));
  const [imageslider, setImageslider] = useState(('none'));
  const [loading, setLoading] = useState(('none'));
  const [portnum, setPortnum] = useState((0));
  const [img, setImg] = useState([]);

  const clearCacheData = () => {
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name);
      });
    });
  };
  
  var map = {}, idindex = {}, edges = [], nodes = [];

  
  (schema.nodes).forEach((value, index) => {
      let num = Number((value.inputs[0].id).slice(5));
      map[Math.floor(num/2)] = value.content;
      nodes.push(value.content);
      idindex[Math.floor(num/2)+1] = index;
  });
  schema.links.forEach((e) => {
      let u = Math.floor((Number((e.input).slice(5)))/2);
      let v = Math.floor((Number((e.output).slice(5)))/2);
      edges.push([idindex[u+1],idindex[v+1]]);
  });
  // console.log(nodes,edges);
  
  const deleteNodeFromSchema = (id) => {
    const nodeToRemove = schema.nodes.find(node => node.id === id);
    removeNode(nodeToRemove);
  };

  const addNewNode = (name) => {
    const nextNode = {
       id: `${name}-${schema.nodes.length+1}`,
       content: `${name}`,
       coordinates: [
        100,
        100
       ],
       render: CustomRender,
       data: {onClick: deleteNodeFromSchema},
       inputs: [{ id: `port-${portnum}`}],
       outputs: [{ id: `port-${portnum+1}`}],
   };
   addNode(nextNode);
   setEditState(true); 
   setPortnum(portnum+2);
  
  //  console.log(schema.nodes[0][0].links);
  }

  const nodeAdding = () => {
    console.log(editState);
    setEditState(false);
  }

  const sendSchema = async () => {

    setLoading('initial');
    setImg([]);
    clearCacheData();
    const file = JSON.stringify({
      "nodes" : nodes,
      "edges" : edges
    });
    console.log(file);

    let postLink = baseURL + '/'
    const response = await api.post("/", file);
    console.log(response);
    
    setImg(imgURL);
    
    // axios.post(postLink, file);

    setLoading('none');
    setImageslider('initial'); 
    // const response = await fetch('http://68fb79cfac33.ngrok.io/', {
    //   method : 'post',
    //   mode : 'no-cors',
    //   headers: {
    //     'Accept' : 'application/json',
    //     'Content-type': 'application/json',
    //   },
    //   body : file
    // }); 
    // console.log(response);
    // setTimeout(() => {  console.log("World!"); }, 2000);
    // console.log("Wait done");
    // let str = 'http://215f4b42602f.ngrok.io/generated/plan1.png';
    // const vartition = 5;
    // let x = document.getElementsByClassName('Pranav')[0];
    // // let y = document.getElementsByClassName('slide selected')[1];

    // while (x.firstChild) {
    //   x.removeChild(x.lastChild);
    // }

    // for(let i=0;i<vartition;i++)
    // { 
    //   var divElement = document.createElement("div");
    //   divElement.classList.add("image");

    //   var imgElement = document.createElement("img");
    //   let path = baseURL + '/generated/plan' + String(Number(i+1)) +'.png';
    //   imgElement.src = path;

    //   divElement.appendChild(imgElement);
    //   x.appendChild(divElement);
    // }

    // console.log(x);
  }

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setCount('Timeout called!');
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <div className="full_window">
      <div className="floor_board">
        <Button  onClick={()=> (nodeAdding())} className = "ui button blue" id="addNode">Add Node</Button>
        <div className="Buttons">
          <div>
            <Button className="buttonRoom hoverbutton" id="but1" disabled={editState} onClick={()=> addNewNode("living")} >Living</Button>
            <Button className="buttonRoom hoverbutton" id="but2" disabled={editState} onClick={()=> addNewNode("kitchen")}>Kitchen</Button>
            <Button className="buttonRoom hoverbutton" id="but3" disabled={editState} onClick={()=> addNewNode("bedroom")}>Bedroom</Button>
            <Button className="buttonRoom hoverbutton" id="but4" disabled={editState} onClick={()=> addNewNode("bathroom")}>Bathroom</Button>
            <Button className="buttonRoom hoverbutton" id="but5" disabled={editState} onClick={()=> addNewNode("closet")}>Closet</Button>
            <Button className="buttonRoom hoverbutton" id="but6" disabled={editState} onClick={()=> addNewNode("balcony")}>Balcony</Button>
            <Button className="buttonRoom hoverbutton" id="but7" disabled={editState} onClick={()=> addNewNode("corridor")}>Corridor</Button>
            <Button className="buttonRoom hoverbutton" id="but8" disabled={editState} onClick={()=> addNewNode("dining")}>Dining</Button>
            <Button className="buttonRoom hoverbutton" id="but9" disabled={editState} onClick={()=> addNewNode("unkown")}>Outside</Button>
          </div>
        </div>
        <div className="graph">
          <Diagram schema={schema} onChange={onChange} style={{backgroundImage: "linear-gradient(to top, #09203f 0%, #537895 100%)",zIndex : "10", position: "relative", display: "visible", height:"738px"}}/>
          <Button  onClick={()=> (sendSchema())} className = "ui button green submit">Submit</Button>
        </div>
      </div>  
      <div className="ganmodel">
        <div style={{display : `${loading}`}}>
          <div className="load">
            <BounceLoader/>
          </div>
        </div>
        
        <div className="forCarousel" style={{display : `${imageslider}`}}>
          <Carousel infiniteLoop autoPlay className='Pranav'>
                {img.map((image, ind) => {
                    return (
                        <div className = "image" key={ind}>
                            <img src={image+ "?a=" + Math.random()}  alt = "blank"/>
                         </div>
                    );
                    
                })}
          </Carousel>
        </div>
        
      </div>  
    </div>
  );
};

export default Plan;
