import React from "react";

interface AvatarProps {
  address?: string
  style?: any
}

const Avatar: React.FC<AvatarProps> = ({ address, style }) => {
  var url = "https://avatars.onflow.org/avatar/avatar" + address + ".svg"
  return (
    <img className="avatar" src={url} style={style} />
  )
};

export default Avatar;
