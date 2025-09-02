export interface ModuleInfo {
    shortName: string;
    longName: string;
    moduleCode: string;
    year: string;
    matirial?: string;
  }
  
  export const MODULES: Record<string, ModuleInfo> = {
    CTSE: {
      shortName: 'CTSE',
      longName: 'Current Trends in Software Engineering',
      moduleCode: 'SE4010',
      year: '4th',
      matirial: 'CTSE.pdf'
    },
    IUP: {
      shortName: 'IUP',
      longName: 'Image Understanding and Processing',
      moduleCode: 'IT4130',
      year: '4th',
      matirial: 'IUP.pdf'
    }
  };
  
  export const AVAILABLE_MODULES = Object.keys(MODULES);