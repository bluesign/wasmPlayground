import { useContext } from "react";
import { ProjectContext, ProjectContextValue } from "./index";

export function useProject(): ProjectContextValue {
  return useContext(ProjectContext);
}

