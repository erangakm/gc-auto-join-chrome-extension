import React from "react"
import { BulletList } from "react-content-loader";

export const EventListSkeleton: React.FC<{}> = () => {

  return (
    <div className="p-2">
      <BulletList />
    </div>
  )
}
