import React from "react";
import { ResultType } from "../../../src/_newTypes/newTypes";
import {useProject} from "providers/Project/projectHooks";


import { Line } from "components/RenderResponse/Line";
import styled from "@emotion/styled";
import { Tag } from "util/normalize-interaction-response";

const Root = styled.div<{ resultType: ResultType }>`
  counter-reset: lines;
  padding: 8px;
  overflow-y: scroll;
  min-height: 40px;
`;

export const RenderResponse: React.FC<{
  resultType: ResultType.Transaction | ResultType.Script | ResultType.Contract;
}> = ({}) => {
  
  const {
    isLoading,
     project,
   } = useProject();
   if (isLoading) return null

   var lines = []

   if (true){
    if ( window.emulatorLog==null) return null
     var n=0
     window.emulatorLog.forEach(log => {
        n=n+1
        if (log.tag==null) log.tag=Tag.UNKNOWN
        //console.log(log)
        lines = lines.concat( (
          <Line tag={log.tag} timestamp={log.timestamp} value={log.message} data={log.data} label="" key={n} />
        ))
      })
      lines = lines.reverse()

   }

   if (false){
        if (project.scriptExecutions==null) return null


        var execution  = project.scriptExecutions[0]

        var executionLogs = execution.logs
        var lines = []

        if (execution.value!=null){
        lines = lines.concat( (
          <Line tag={Tag.VALUE} timestamp={execution.executionTimeLabel} value={execution.value} label="Script" key={0} />
        ))
        }

      lines = lines.concat( executionLogs.map((line, n) => {
          return (
            <Line tag={Tag.LOG} timestamp={line.time} value={line.value} label="Script" key={n+1} />
          )
        })
        )
        
        if  (execution.errors!=null){
          lines = lines.concat( execution.errors.map((line, n) => {
            return (
              <Line tag={Tag.ERROR} timestamp={execution.executionTimeLabel} value={line.message} label="Script" key={n+1} />
            )
          })
          )
        }
   }
  return (
    <Root resultType={ResultType.Contract}>
      {lines}
    </Root>
  );
};
