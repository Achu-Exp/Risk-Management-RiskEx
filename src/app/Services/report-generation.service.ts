import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface RiskAssessment {
  assessmentBasis: string | null;
  id: number;
  matrixImpact: string;
  matrixLikelihood: string;
  reviewStatus: string;
  reviewer: string;
}

interface Risk {
  // ... keeping same Risk interface ...
  closedDate: string;
  contingency: string;
  createdAt: string;
  createdBy: string;
  departmentId: number;
  departmentName: string;
  description: string;
  email: string;
  id: number;
  impact: string;
  mitigation: string;
  overallRiskRating: number;
  plannedActionDate: string;
  projectId: number | null;
  remarks: string;
  responsibleUser: string;
  responsibleUserId: number;
  riskAssessments: RiskAssessment[];
  riskId: string;
  riskName: string;
  riskResponse: string;
  riskStatus: string;
  riskType: string;
  updatedAt: string;
  updatedBy: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportGenerationService {
  private readonly styles = {
    mainHeader: {
      font: { bold: true, color: { rgb: "FFFFFF" }, size: 12 },
      fill: { fgColor: { rgb: "1F4E78" } },
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
      border: {
        top: { style: "medium", color: { rgb: "000000" } },
        bottom: { style: "medium", color: { rgb: "000000" } },
        left: { style: "medium", color: { rgb: "000000" } },
        right: { style: "medium", color: { rgb: "000000" } }
      }
    },
    assessmentHeader: {
      font: { bold: true, color: { rgb: "FFFFFF" }, size: 11 },
      fill: { fgColor: { rgb: "4472C4" } },
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
      }
    },
    subHeader: {
      font: { bold: true, color: { rgb: "FFFFFF" }, size: 11 },
      fill: { fgColor: { rgb: "2F75B5" } },
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
      }
    },
    cell: {
      font: { color: { rgb: "000000" }, size: 11 },
      alignment: { vertical: "center", wrapText: true },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
      }
    }
  };

  generateReport(data: Risk[], fileName: string): void {
    try {
      const workbook: XLSX.WorkBook = { SheetNames: [], Sheets: {} };

      // Define headers for Security & Privacy risks
      const securityHeaders = [
        // Main sections header
        [
          { v: 'Risk Information', s: this.styles.mainHeader },
          { v: 'Risk Assessment Matrix', s: this.styles.mainHeader }
        ],
        // Pre/Post mitigation headers
        [
          { v: '', s: this.styles.cell }, // Empty cells for Risk Information section
          { v: '', s: this.styles.cell },
          { v: '', s: this.styles.cell },
          { v: '', s: this.styles.cell },
          { v: '', s: this.styles.cell },
          { v: '', s: this.styles.cell },
          { v: '', s: this.styles.cell },
          { v: '', s: this.styles.cell },
          { v: '', s: this.styles.cell },
          { v: '', s: this.styles.cell },
          { v: '', s: this.styles.cell },
          { v: '', s: this.styles.cell },
          { v: '', s: this.styles.cell },
          { v: '', s: this.styles.cell },
          { v: '', s: this.styles.cell },
          { v: 'Pre-Mitigation Assessment', s: this.styles.mainHeader },
          { v: '', s: this.styles.mainHeader },
          { v: '', s: this.styles.mainHeader },
          { v: '', s: this.styles.mainHeader },
          { v: '', s: this.styles.mainHeader },
          { v: '', s: this.styles.mainHeader },
          { v: '', s: this.styles.mainHeader },
          { v: '', s: this.styles.mainHeader },
          { v: 'Post-Mitigation Assessment', s: this.styles.mainHeader },
          { v: '', s: this.styles.mainHeader },
          { v: '', s: this.styles.mainHeader },
          { v: '', s: this.styles.mainHeader },
          { v: '', s: this.styles.mainHeader },
          { v: '', s: this.styles.mainHeader },
          { v: '', s: this.styles.mainHeader },
          { v: '', s: this.styles.mainHeader }
        ],
        // Assessment type headers for security
        [
          ...Array(15).fill({ v: '', s: this.styles.cell }), // Empty cells for Risk Information
          { v: 'Confidentiality', s: this.styles.assessmentHeader },
          { v: '', s: this.styles.assessmentHeader },
          { v: 'Integrity', s: this.styles.assessmentHeader },
          { v: '', s: this.styles.assessmentHeader },
          { v: 'Privacy', s: this.styles.assessmentHeader },
          { v: '', s: this.styles.assessmentHeader },
          { v: 'Availability', s: this.styles.assessmentHeader },
          { v: '', s: this.styles.assessmentHeader },
          { v: 'Confidentiality', s: this.styles.assessmentHeader },
          { v: '', s: this.styles.assessmentHeader },
          { v: 'Integrity', s: this.styles.assessmentHeader },
          { v: '', s: this.styles.assessmentHeader },
          { v: 'Privacy', s: this.styles.assessmentHeader },
          { v: '', s: this.styles.assessmentHeader },
          { v: 'Availability', s: this.styles.assessmentHeader },
          { v: '', s: this.styles.assessmentHeader }
        ],
        // Column headers for security
        [
          { v: 'Risk ID', s: this.styles.subHeader },
          { v: 'Risk Name', s: this.styles.subHeader },
          { v: 'Department', s: this.styles.subHeader },
          { v: 'Description', s: this.styles.subHeader },
          { v: 'Risk Type', s: this.styles.subHeader },
          { v: 'Risk Status', s: this.styles.subHeader },
          { v: 'Impact', s: this.styles.subHeader },
          { v: 'Mitigation', s: this.styles.subHeader },
          { v: 'Contingency', s: this.styles.subHeader },
          { v: 'Risk Response', s: this.styles.subHeader },
          { v: 'Overall Risk Rating', s: this.styles.subHeader },
          { v: 'Responsible User', s: this.styles.subHeader },
          { v: 'Created By', s: this.styles.subHeader },
          { v: 'Created At', s: this.styles.subHeader },
          { v: 'Remarks', s: this.styles.subHeader },
          ...Array(16).fill({ v: '', s: this.styles.subHeader }).map((cell, index) =>
            ({ ...cell, v: index % 2 === 0 ? 'Impact' : 'Likelihood' }))
        ]
      ];

      // Define simpler headers for Quality risks
      const qualityHeaders = [
        // Main sections header
        [
          { v: 'Risk Information', s: this.styles.mainHeader },
          { v: 'Risk Assessment', s: this.styles.mainHeader }
        ],
        // Pre/Post mitigation headers
        [
          ...Array(15).fill({ v: '', s: this.styles.cell }), // Empty cells for Risk Information
          { v: 'Pre-Mitigation Assessment', s: this.styles.mainHeader },
          { v: '', s: this.styles.mainHeader },
          { v: 'Post-Mitigation Assessment', s: this.styles.mainHeader },
          { v: '', s: this.styles.mainHeader }
        ],
        // Column headers for quality
        [
          { v: 'Risk ID', s: this.styles.subHeader },
          { v: 'Risk Name', s: this.styles.subHeader },
          { v: 'Department', s: this.styles.subHeader },
          { v: 'Description', s: this.styles.subHeader },
          { v: 'Risk Type', s: this.styles.subHeader },
          { v: 'Risk Status', s: this.styles.subHeader },
          { v: 'Impact', s: this.styles.subHeader },
          { v: 'Mitigation', s: this.styles.subHeader },
          { v: 'Contingency', s: this.styles.subHeader },
          { v: 'Risk Response', s: this.styles.subHeader },
          { v: 'Overall Risk Rating', s: this.styles.subHeader },
          { v: 'Responsible User', s: this.styles.subHeader },
          { v: 'Created By', s: this.styles.subHeader },
          { v: 'Created At', s: this.styles.subHeader },
          { v: 'Remarks', s: this.styles.subHeader },
          { v: 'Impact', s: this.styles.subHeader },
          { v: 'Likelihood', s: this.styles.subHeader },
          { v: 'Impact', s: this.styles.subHeader },
          { v: 'Likelihood', s: this.styles.subHeader }
        ]
      ];

      const createSecuritySheetWithHeaders = (data: any[][]) => {
        const ws = XLSX.utils.aoa_to_sheet([...securityHeaders, ...data]);
        // Merge ranges for security sheet
        ws['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 14 } },  // Risk Information
          { s: { r: 0, c: 15 }, e: { r: 0, c: 31 } }, // Risk Assessment Matrix
          { s: { r: 1, c: 15 }, e: { r: 1, c: 22 } }, // Pre-Mitigation
          { s: { r: 1, c: 23 }, e: { r: 1, c: 31 } }, // Post-Mitigation
          // Assessment type headers
          { s: { r: 2, c: 15 }, e: { r: 2, c: 16 } }, // Confidentiality
          { s: { r: 2, c: 17 }, e: { r: 2, c: 18 } }, // Integrity
          { s: { r: 2, c: 19 }, e: { r: 2, c: 20 } }, // Privacy
          { s: { r: 2, c: 21 }, e: { r: 2, c: 22 } }, // Availability
          { s: { r: 2, c: 23 }, e: { r: 2, c: 24 } }, // Post Confidentiality
          { s: { r: 2, c: 25 }, e: { r: 2, c: 26 } }, // Post Integrity
          { s: { r: 2, c: 27 }, e: { r: 2, c: 28 } }, // Post Privacy
          { s: { r: 2, c: 29 }, e: { r: 2, c: 30 } }  // Post Availability
        ];
        ws['!cols'] = Array(32).fill({ wch: 15 });
        return ws;
      };

      const createQualitySheetWithHeaders = (data: any[][]) => {
        const ws = XLSX.utils.aoa_to_sheet([...qualityHeaders, ...data]);
        // Merge ranges for quality sheet
        ws['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 14 } },  // Risk Information
          { s: { r: 0, c: 15 }, e: { r: 0, c: 18 } }, // Risk Assessment
          { s: { r: 1, c: 15 }, e: { r: 1, c: 16 } }, // Pre-Mitigation
          { s: { r: 1, c: 17 }, e: { r: 1, c: 18 } }  // Post-Mitigation
        ];
        ws['!cols'] = Array(19).fill({ wch: 15 });
        return ws;
      };

      const qualitySheetData: any[][] = [];
      const securityPrivacySheetData: any[][] = [];

      // Process each risk
      data.forEach((risk) => {
        const getAssessmentDetails = (assessments: any[], basis: string, isMitigated: boolean) => {
          const assessment = assessments.find(a =>
            a.assessmentBasis === basis && a.isMitigated === isMitigated
          );
          return {
            impact: assessment?.matrixImpact || '',
            likelihood: assessment?.matrixLikelihood || ''
          };
        };

        const formatDate = (dateString: string | null) => {
          if (!dateString) return '';
          return new Date(dateString).toLocaleString();
        };

        const baseRiskInfo = [
          { v: risk.riskId || '', s: this.styles.cell },
          { v: risk.riskName || '', s: this.styles.cell },
          { v: risk.departmentName || '', s: this.styles.cell },
          { v: risk.description || '', s: this.styles.cell },
          { v: risk.riskType || '', s: this.styles.cell },
          { v: risk.riskStatus || '', s: this.styles.cell },
          { v: risk.impact || '', s: this.styles.cell },
          { v: risk.mitigation || '', s: this.styles.cell },
          { v: risk.contingency || '', s: this.styles.cell },
          { v: risk.riskResponse || '', s: this.styles.cell },
          { v: risk.overallRiskRating || '', s: this.styles.cell },
          { v: risk.responsibleUser || '', s: this.styles.cell },
          { v: risk.createdBy || '', s: this.styles.cell },
          { v: formatDate(risk.createdAt), s: this.styles.cell },
          { v: risk.remarks || '', s: this.styles.cell }
        ];

        if (risk.riskType === 'Quality') {
          // For Quality risks, only include general impact and likelihood
          const preAssessment = getAssessmentDetails(risk.riskAssessments || [], 'Quality', false);
          const postAssessment = getAssessmentDetails(risk.riskAssessments || [], 'Quality', true);

          const qualityRow = [
            ...baseRiskInfo,
            { v: preAssessment.impact, s: this.styles.cell },
            { v: preAssessment.likelihood, s: this.styles.cell },
            { v: postAssessment.impact, s: this.styles.cell },
            { v: postAssessment.likelihood, s: this.styles.cell }
          ];

          qualitySheetData.push(qualityRow);
        } else if (risk.riskType === 'Security' || risk.riskType === 'Privacy') {
          // For Security/Privacy risks, include all assessment types
          const assessmentTypes = ['Confidentiality', 'Integrity', 'Privacy', 'Availability'];
          const preMitigationCells = [];
          const postMitigationCells = [];

          for (const type of assessmentTypes) {
            const preAssessment = getAssessmentDetails(risk.riskAssessments || [], type, false);
            const postAssessment = getAssessmentDetails(risk.riskAssessments || [], type, true);

            preMitigationCells.push(
              { v: preAssessment.impact, s: this.styles.cell },
              { v: preAssessment.likelihood, s: this.styles.cell }
            );
            postMitigationCells.push(
              { v: postAssessment.impact, s: this.styles.cell },
              { v: postAssessment.likelihood, s: this.styles.cell }
            );
          }

          const securityRow = [
            ...baseRiskInfo,
            ...preMitigationCells,
            ...postMitigationCells
          ];

          securityPrivacySheetData.push(securityRow);
        }
      });

      // Create sheets with appropriate headers
      const qualitySheet = createQualitySheetWithHeaders(qualitySheetData);
      const securityPrivacySheet = createSecuritySheetWithHeaders(securityPrivacySheetData);

      // Add sheets to workbook
      workbook.SheetNames.push('Quality Risks', 'Security & Privacy Risks');
      workbook.Sheets['Quality Risks'] = qualitySheet;
      workbook.Sheets['Security & Privacy Risks'] = securityPrivacySheet;

      // Generate and download file
      const excelBuffer: any = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });

      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, `${fileName}.xlsx`);

    } catch (error) {
      console.error('Error generating Excel report:', error);
      throw new Error(`Failed to generate Excel report: ${error}`);
    }
  }
}
