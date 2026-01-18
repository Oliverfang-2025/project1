// About page types for skills, experiences, and education

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-100
  category: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  period: string;
  description: string;
}

// Sample data for initialization
export const SAMPLE_SKILLS: Skill[] = [
  { id: '1', name: "半导体生产管理", level: 95, category: "专业技能" },
  { id: '2', name: "测试厂建设规划", level: 90, category: "专业技能" },
  { id: '3', name: "IATF16949体系", level: 85, category: "质量体系" },
  { id: '4', name: "AI编程", level: 80, category: "技术能力" },
  { id: '5', name: "IT系统规划与管理", level: 85, category: "技术能力" },
  { id: '6', name: "Office软件应用", level: 95, category: "办公技能" }
];

export const SAMPLE_EXPERIENCES: Experience[] = [
  {
    id: '1',
    title: "生产部长",
    company: "无锡市宜欣科技有限公司",
    period: "2022年7月 - 至今",
    description: "主导车间建厂过程管理，设备选型和管理，体系建设，IT化系统建设，生产管理与运营，以及团队建设。成功建立车规级芯片FT测试和CP测试能力，通过IATF16949认证，实现月产值300万+。"
  },
  {
    id: '2',
    title: "生产技术培训体系负责人",
    company: "成都芯源系统有限公司",
    period: "2010年7月 - 2022年7月",
    description: "12年生产运营管理经验，历任产线技术员、STR技术工程师、制造部培训负责人，积累1000+小时培训经历，负责生产运营部所有一线岗位的培训和考核体系课程开发执行。"
  }
];

export const SAMPLE_EDUCATIONS: Education[] = [
  {
    id: '1',
    degree: "本科",
    school: "四川大学",
    period: "2018年9月 - 2020年6月",
    description: "人力资源管理（工商管理类）"
  },
  {
    id: '2',
    degree: "大专",
    school: "成都工业学院",
    period: "2007年9月 - 2010年6月",
    description: "机械电子工程"
  }
];
