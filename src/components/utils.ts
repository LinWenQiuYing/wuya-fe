import { AideKey } from "@/client/const";
import analysisCircle from "./images/analysis-circle.png";
import analysisSquare from "./images/analysis-square.png";
import analysisBackground from "./images/analysis-background.png";
import auditCircle from "./images/audit-circle.png";
import auditSquare from "./images/audit-square.png";
import auditBackground from "./images/audit-background.png";
import surveyCircle from "./images/survey-circle.png";
import surveySquare from "./images/survey-square.png";
import surveyBackground from "./images/survey-background.png";
import videoCircle from "./images/video-circle.png";
import videoSquare from "./images/video-square.png";
import videoBackground from "./images/video-background.png";
import helpdeskCircle from "./images/helpdesk-circle.png";
import helpdeskSquare from "./images/helpdesk-square.png";
import helpdeskBackground from "./images/helpdesk-background.png";
import financialBackground from "./images/financial-background.png";
import financialCircle from "./images/financial-circle.png";
import financialSquare from "./images/financial-square.png";

type AgentImgState = {
  circle: string;
  square: string;
  background: string;
};

export const agentImgSrc = new Map<AideKey, AgentImgState>([
  [AideKey.DATA_ANALYSIS, { circle: analysisCircle, square: analysisSquare, background: analysisBackground }],
  [AideKey.ENTERPRISE_RESEARCH, { circle: surveyCircle, square: surveySquare, background: surveyBackground }],
  [AideKey.CONTRACT_AUDIT, { circle: auditCircle, square: auditSquare, background: auditBackground }],
  [AideKey.VIDEO_PARSE, { circle: videoCircle, square: videoSquare, background: videoBackground }],
  [
    AideKey.CUSTOMER_SERVICE,
    { circle: helpdeskCircle, square: helpdeskSquare, background: helpdeskBackground },
  ],
  [
    AideKey.FINANCIAL_ANALYSIS,
    { circle: financialCircle, square: financialSquare, background: financialBackground },
  ],
]);
