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

const baseURL = "http://34.135.231.231:5000";
const imgURL = ["https://storage.googleapis.com/housegan-3f845.appspot.com/floorplan/plan0.jpg", "https://storage.googleapis.com/housegan-3f845.appspot.com/floorplan/plan1.jpg", "https://storage.googleapis.com/housegan-3f845.appspot.com/floorplan/plan2.jpg",  "https://storage.googleapis.com/housegan-3f845.appspot.com/floorplan/plan3.jpg",  "https://storage.googleapis.com/housegan-3f845.appspot.com/floorplan/plan4.jpg",  "https://storage.googleapis.com/housegan-3f845.appspot.com/floorplan/plan5.jpg", "https://storage.googleapis.com/housegan-3f845.appspot.com/floorplan/plan6.jpg",  "https://storage.googleapis.com/housegan-3f845.appspot.com/floorplan/plan7.jpg"]
// const imgURL= [`${baseURL}/generated/plan1.png`,`${baseURL}/generated/plan2.png`,`${baseURL}/generated/plan3.png`,`${baseURL}/generated/plan4.png`,`${baseURL}/generated/plan5.png`,`${baseURL}/generated/plan6.png`,`${baseURL}/generated/plan7.png`]

const Plan = () => {
  // create diagrams schema

  
  const [schema, { onChange, addNode, removeNode }] = useSchema(initialSchema);
  const [editState, setEditState] = useState((true));
  const [imageslider, setImageslider] = useState(('none'));
  const [loading, setLoading] = useState(('none'));
  const [portnum, setPortnum] = useState((0));
  const [img, setImg] = useState([]);
  // const [areaMap, setAreaMap] = useState({});
  const inputKeyRef = React.useRef();
  const inputValueRef = React.useRef();
  const areaMap = {};

  // const clearCacheData = () => {
  //   caches.keys().then((names) => {
  //     names.forEach((name) => {
  //       caches.delete(name);
  //     });
  //   });
  // };

  //  here adding above function

  const NodeStyleComponent = (props) =>{
    const [area, setArea] = useState('');
    const [finalArea, setFinalArea] = useState('');
  
    const inputChange = (e) => {
      setArea(e.target.value);
    }
  
    const onSubmits = (e) => {
      e.preventDefault();
      // setAreaMap({ ...areaMap, [props.id]:area});
      areaMap[props.id] = area;
      console.log(props.id, areaMap, area);
      setFinalArea(area);
      setArea('');
    }
    
    return(
      <div className="node_style" style={{backgroundColor:`${props.color}`, width:`${props.width}`, height:`${props.height}`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", boxShadow: `0 0 20px ${props.color}`}}>
        <div style={{textAlign: 'right'}}>
        <CancelIcon fontSize ="small" onClick={() => props.data.onClick(props.id)} style = {{position: 'absolute',backgroundColor:"white", color: 'red',right:'-6px', top: '-7px', cursor: 'default', borderRadius:"50px", margin:"0px"}}/>
        </div>
        <div role="button" style={{ position:"relative", padding: '0px', textAlign: 'center', fontWeight:"bold", color: "black", fontFamily:"poppins" ,top: `${props.contentTop}`}}>
            <p>{props.content}</p>
            <p>{finalArea} m<sup>2</sup></p>
        </div>
        <div className = ".form" style={{position:"relative", top:`${props.inputTop}`}}>
          <form onSubmit={onSubmits}>
            <input text="text" placeholder="Edit Area" name='area' value={area} style={{width:`${props.width}`}} onChange={inputChange}/>
          </form>
        </div>
        <div>       
            {props.inputs.map((port) => React.cloneElement(port, {style: {  width: '30px', height: `${props.height}`, background: '#1B263B', opacity: "0.0", borderRadius:"10px", position:"relative", right:`${props.port1right}`, top:`${props.port1top}`}}))}
            {props.outputs.map((port) => React.cloneElement(port, {style: { width: '30px', height: `${props.height}`, background: '#1B263B', opacity: "0.0", borderRadius:"10px", position:"relative", right:`${props.port2right}`, top:`${props.port2top}`}}))}
        </div>
        
      </div>
    );
  }
  
  const CustomRender = ({ id, content, data, inputs, outputs}) => {
      // console.log(content);
      // areaInput();
      if (content === "bedroom") {
  
        return <NodeStyleComponent id={id} content={content} data={data} inputs={inputs} outputs={outputs} color="rgb(255, 165, 0)" width="90px" height="100px" port1right="40px" port1top="25px" port2right="-40px" port2top="-65px" contentTop="100px" inputTop="130px"/>;
      }
      else if (content === "bathroom") {
        
        return <NodeStyleComponent id={id} content={content} data={data} inputs={inputs} outputs={outputs} color="rgb(128, 128, 128)" width="88px" height="60px" port1right="42px" port1top="5px" port2right="-40px" port2top="-45px" contentTop="65px" inputTop="70px"/>;
      }
      else if (content === "living") {
        
        return <NodeStyleComponent id={id} content={content} data={data} inputs={inputs} outputs={outputs} color="rgb(165, 42, 42)" width="90px" height="100px" port1right="40px" port1top="27px" port2right="-40px" port2top="-65px" contentTop="100px" inputTop="130px"/>;
      }
      else if (content === "kitchen") {
        
        return <NodeStyleComponent id={id} content={content} data={data} inputs={inputs} outputs={outputs} color="rgb(255, 0, 255)" width="80px" height="75px" port1right="38px" port1top="15px" port2right="-38px" port2top="-55px" contentTop="75px" inputTop="90px"/>;
      }
      else if (content === "closet") {
        
        return <NodeStyleComponent id={id} content={content} data={data} inputs={inputs} outputs={outputs} color="rgb(255, 0, 0)" width="88px" height="60px" port1right="42px" port1top="5px" port2right="-40px" port2top="-45px" contentTop="65px" inputTop="70px"/>;
      }
      else if (content === "balcony") {
        
        return <NodeStyleComponent id={id} content={content} data={data} inputs={inputs} outputs={outputs} color="rgb(0, 0, 255)" width="88px" height="60px" port1right="42px" port1top="5px" port2right="-40px" port2top="-45px" contentTop="65px" inputTop="70px"/>;
      }
      else if (content === "corridor") {
        
        return <NodeStyleComponent id={id} content={content} data={data} inputs={inputs} outputs={outputs} color="rgb(0, 255, 255)" width="88px" height="60px" port1right="42px" port1top="5px" port2right="-40px" port2top="-45px" contentTop="65px" inputTop="70px"/>;
      }
      else if (content === "dining") {
        
        return <NodeStyleComponent id={id} content={content} data={data} inputs={inputs} outputs={outputs} color="rgb(0, 128, 0)" width="80px" height="75px" port1right="38px" port1top="15px" port2right="-38px" port2top="-55px" contentTop="75px" inputTop="90px"/>;
      }
      else
      {
        
        return <NodeStyleComponent id={id} content={content} data={data} inputs={inputs} outputs={outputs} color="rgb(255, 255, 0)" width="80px" height="75px" port1right="38px" port1top="15px" port2right="-38px" port2top="-55px" contentTop="75px" inputTop="90px"/>;
      }
  };
  
  //  adding end here
  var map = {}, idindex = {}, edges = [], nodes = [], areas = [];

  console.log(areaMap);
  (schema.nodes).forEach((value, index) => {
      let num = Number((value.inputs[0].id).slice(5));
      map[Math.floor(num/2)] = value.content;
      nodes.push(value.content);
      idindex[Math.floor(num/2)+1] = index;
      areas.push(areaMap[value.inputs[0].id]);
  });
  schema.links.forEach((e) => {
      let u = Math.floor((Number((e.input).slice(5)))/2);
      let v = Math.floor((Number((e.output).slice(5)))/2);
      edges.push([idindex[u+1],idindex[v+1]]);
  });
  console.log(nodes,edges,areas);
  
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
   setPortnum(portnum+2);
  
  //  console.log(schema.nodes[0][0].links);
  }

  const nodeAdding = () => {
    console.log(editState);
    setEditState(false);
  }

  const sendSchema = async () => {

    setLoading('initial');
    // setImg([]);
    // clearCacheData();
    const file = JSON.stringify({
      "nodes" : nodes,
      "edges" : edges
    });
    console.log(file);

    let postLink = baseURL + '/'
    const response = await api.post("/", file);
    console.log(response);
    
    
    // axios.post(postLink, file);

    setImg(imgURL);
    setLoading('none');
    setImageslider('initial'); 
    // const response = await fetch(postLink, {
    //   method : 'post',
    //   mode : 'no-cors',
    //   headers: {
    //     'Accept' : 'application/json',
    //     'Content-type': 'application/json',
    //   },
    //   body : file
    // }); 
    // console.log(response);
    
  }

  return (
    <div className="full_window">
      <div className="floor_board">
        <Button  onClick={nodeAdding} className = "ui button blue" id="addNode">Add Node</Button>
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
          <Diagram schema={schema} onChange={onChange}  style={{backgroundColor: "#000000",zIndex : "10", position: "relative", display: "visible", height:"738px"}}/>
          <Button  onClick={sendSchema} className = "ui button green submit">Submit</Button>
        </div>
        
      </div>  
      <div className="ganmodel">
        <div style={{display : `${loading}`}}>
          <div className="load">
            <BounceLoader/>
          </div>
        </div>
        
        <div className="forCarousel" style={{display : `${imageslider}`}}>
          <Carousel autoPlay className='Pranav'>
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
// 