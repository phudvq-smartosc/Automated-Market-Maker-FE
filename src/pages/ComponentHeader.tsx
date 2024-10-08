import React from "react";
import BackIcon from "../components/icon/BackIcon";
import {IconButton} from "@material-tailwind/react"


interface ComponentHeaderInterface {
  name: string
}
const ComponentHeader: React.FC<ComponentHeaderInterface> = ({name}:ComponentHeaderInterface) => {
  
  return (
    <div className="flex items-center justify-center p-4">
      
      <h1 className="text-3xl font-bold text-gray-800">{name}</h1>

    </div>
  );
};

export default ComponentHeader;
