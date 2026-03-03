#!/usr/bin/env python3
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import os

OUTPUT = os.path.expanduser("~/OneDrive - First Baptist Church Arlington/Attendance Reports/FBCA_Attendance_2026-03-01.pdf")
os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)

doc = SimpleDocTemplate(OUTPUT, pagesize=letter,
    rightMargin=0.75*inch, leftMargin=0.75*inch,
    topMargin=0.75*inch, bottomMargin=0.75*inch)

styles = getSampleStyleSheet()
FBCA_BLUE = colors.HexColor('#1a3a6b')
FBCA_LIGHT = colors.HexColor('#e8eef5')
ACCENT = colors.HexColor('#c8a84b')

title_style = ParagraphStyle('Title', parent=styles['Normal'],
    fontSize=22, fontName='Helvetica-Bold', textColor=FBCA_BLUE,
    alignment=TA_CENTER, spaceAfter=4)
subtitle_style = ParagraphStyle('Subtitle', parent=styles['Normal'],
    fontSize=11, fontName='Helvetica', textColor=colors.HexColor('#666666'),
    alignment=TA_CENTER, spaceAfter=2)
section_style = ParagraphStyle('Section', parent=styles['Normal'],
    fontSize=13, fontName='Helvetica-Bold', textColor=FBCA_BLUE,
    spaceBefore=14, spaceAfter=6)
note_style = ParagraphStyle('Note', parent=styles['Normal'],
    fontSize=9, fontName='Helvetica-Oblique', textColor=colors.HexColor('#888888'),
    spaceBefore=4)

story = []

# Header
story.append(Paragraph("First Baptist Church Arlington", title_style))
story.append(Paragraph("Sunday Attendance Report", subtitle_style))
story.append(Paragraph("March 1, 2026", subtitle_style))
story.append(Spacer(1, 0.1*inch))
story.append(HRFlowable(width="100%", thickness=2, color=ACCENT))
story.append(Spacer(1, 0.15*inch))

# Summary Table
story.append(Paragraph("Attendance Summary", section_style))

summary_data = [
    ['Ministry Area', 'Count', 'Notes'],
    ['Preschool', '96', 'Full check-in via PCO'],
    ['Children (K-6th Grade)', '98', 'Full check-in via PCO'],
    ['Youth (The Break)', '49*', '*Feb 26 data — Mar 1 not captured in check-in'],
    ['Adults', '651', 'Sunday School class attendance (attended only)'],
    ['TOTAL', '894+', ''],
]

summary_table = Table(summary_data, colWidths=[2.8*inch, 1.1*inch, 3.3*inch])
summary_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), FBCA_BLUE),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
    ('FONTSIZE', (0,0), (-1,0), 10),
    ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
    ('FONTSIZE', (0,1), (-1,-1), 10),
    ('BACKGROUND', (0,-1), (-1,-1), FBCA_LIGHT),
    ('FONTNAME', (0,-1), (-1,-1), 'Helvetica-Bold'),
    ('ROWBACKGROUNDS', (0,1), (-1,-2), [colors.white, FBCA_LIGHT]),
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cccccc')),
    ('ALIGN', (1,0), (1,-1), 'CENTER'),
    ('TOPPADDING', (0,0), (-1,-1), 6),
    ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ('LEFTPADDING', (0,0), (-1,-1), 10),
]))
story.append(summary_table)
story.append(Spacer(1, 0.2*inch))

# Preschool Detail
story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#dddddd')))
story.append(Paragraph("Preschool Detail", section_style))

ps_data = [
    ['Room', 'Children', 'Volunteers'],
    ['Room 108 – Threes', '13', ''],
    ['Room 108 – Early Worship', '13', ''],
    ['Room 110 – Threes', '12', ''],
    ['Room 114 – Kindergarten', '12', ''],
    ['Room 116 – Kindergarten', '10', ''],
    ['Room 126 – Twos', '10', ''],
    ['Room 127 – Twos', '7', ''],
    ['Room 147 – Ones', '5', ''],
    ['Room 149 – Talkers', '7', ''],
    ['Room 149 – Early Worship', '4', ''],
    ['Room 111 – Pre-K', '7', ''],
    ['Room 113 – Pre-K', '6', ''],
    ['Room 138 – Babies', '4', ''],
    ['Room 138 – Early Worship', '1', ''],
    ['Room 152 – Toddlers', '6', ''],
    ['Room 154 – Crawlers', '5', ''],
    ['Preschool Subtotal', '122', '54 volunteers'],
]

ps_table = Table(ps_data, colWidths=[3.5*inch, 1.5*inch, 2.2*inch])
ps_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), FBCA_BLUE),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
    ('FONTSIZE', (0,0), (-1,-1), 9),
    ('FONTNAME', (0,1), (-1,-2), 'Helvetica'),
    ('FONTNAME', (0,-1), (-1,-1), 'Helvetica-Bold'),
    ('BACKGROUND', (0,-1), (-1,-1), FBCA_LIGHT),
    ('ROWBACKGROUNDS', (0,1), (-1,-2), [colors.white, FBCA_LIGHT]),
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cccccc')),
    ('ALIGN', (1,0), (-1,-1), 'CENTER'),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
]))
story.append(ps_table)

# Children Detail
story.append(Spacer(1, 0.15*inch))
story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#dddddd')))
story.append(Paragraph("Children Detail (K-6th Grade)", section_style))

ch_data = [
    ['Room / Grade', 'Children', 'Volunteers'],
    ['B-210: 1st Grade', '10', ''],
    ['A-208: First Grade', '9', ''],
    ['A-211: 2nd Grade', '6', ''],
    ['B-212: 2nd Grade', '7', ''],
    ['A-213: 3rd Grade', '10', ''],
    ['B-218: 3rd Grade', '5', ''],
    ['A-219: 4th Grade', '6', ''],
    ['B-220: 4th Grade', '6', ''],
    ['A-221: 5th Grade', '9', ''],
    ['B-222: 5th Grade', '6', ''],
    ['Room 203: 6th Grade', '16', ''],
    ['Room 154', '5', ''],
    ['Children Subtotal', '95', '30 volunteers'],
]

ch_table = Table(ch_data, colWidths=[3.5*inch, 1.5*inch, 2.2*inch])
ch_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), FBCA_BLUE),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
    ('FONTSIZE', (0,0), (-1,-1), 9),
    ('FONTNAME', (0,1), (-1,-2), 'Helvetica'),
    ('FONTNAME', (0,-1), (-1,-1), 'Helvetica-Bold'),
    ('BACKGROUND', (0,-1), (-1,-1), FBCA_LIGHT),
    ('ROWBACKGROUNDS', (0,1), (-1,-2), [colors.white, FBCA_LIGHT]),
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cccccc')),
    ('ALIGN', (1,0), (-1,-1), 'CENTER'),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
]))
story.append(ch_table)

# Adult Detail
story.append(Spacer(1, 0.15*inch))
story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#dddddd')))
story.append(Paragraph("Adult Sunday School Detail", section_style))

adult_data = [
    ['Class', 'Category', 'Attended', 'Visitors'],
    ['Goodyear (Chapel)', 'Trads', '57', '2'],
    ['Bishop (Rm 226)', 'Boomers', '61', '1'],
    ['Tate – Crossroads (Rm. 226)', 'Median Adults', '44', '6'],
    ['Williams Women (The Loft)', 'Boomers', '37', '0'],
    ['Graham (Rm 146)', 'Trads', '22', '1'],
    ['McClung/Adair – Coed', 'Trads', '18', '2'],
    ['McClung/Adair – Women3', 'Trads', '19', '0'],
    ['McClung/Adair – Women', 'Trads', '14', '0'],
    ['McClung/Adair – Women2', 'Trads', '14', '0'],
    ['McClung/Adair – Men', 'Trads', '10', '0'],
    ['Dove/Williams (Rm 140)', 'Trads', '19', '0'],
    ['Acreback (Rm 141)', 'Trads', '19', '0'],
    ['Collins/Sakdinawat (Rm 142)', 'Trads', '12', '0'],
    ['Burk Women (Rm 145)', 'Trads', '9', '0'],
    ['Graves (Rm 123)', 'Trads', '9', '0'],
    ['Williams Men (The Loft)', 'Boomers', '20', '0'],
    ['Hawkins/Craig (Rm 228)', 'Boomers', '17', '0'],
    ['Barry (Rm 223)', 'Boomers', '26', '0'],
    ['Goble (Rm 200)', 'Boomers', '10', '0'],
    ['McCaskill/Burgdorf (Rm 201)', 'Median Adults', '19', '0'],
    ['Cunningham (Rm 206)', 'Median Adults', '13', '0'],
    ['Richardson – Encouragers', 'Median Adults', '9', '0'],
    ['Cheung (Rm 225)', 'Median Adults', '0', '24'],
    ['Dake (Rm. 202)', 'Median Adults', '0', '12'],
    ['Byrd (Rm 203)', 'Median Adults', '6', '0'],
    ['Tucker (Rm 233)', 'Median Adults', '0', '4'],
    ['Rooted', 'Young Adults', '24', '0'],
    ['Yellow Sub', 'Young Adults', '24', '0'],
    ['Foundation', 'Young Adults', '22', '0'],
    ['Launch', 'Young Adults', '13', '1'],
    ['Central Perk', 'Young Adults', '9', '2'],
    ['The Knot', 'Young Adults', '13', '0'],
    ['Dowdy (Rm 231 – 8am)', 'Other Adults', '3', '0'],
    ['Jones (Rm 201)', 'Other Adults', '4', '0'],
    ["Caffey/O'Neal/Payne (Rm 208)", 'Median Adults', '⚠️ Not recorded', ''],
    ['', '', '', ''],
    ['TOTAL ADULTS', '', '651', ''],
]

adult_table = Table(adult_data, colWidths=[2.7*inch, 1.4*inch, 1.2*inch, 1.0*inch])
adult_table.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), FBCA_BLUE),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
    ('FONTSIZE', (0,0), (-1,-1), 9),
    ('FONTNAME', (0,1), (-1,-3), 'Helvetica'),
    ('FONTNAME', (0,-1), (-1,-1), 'Helvetica-Bold'),
    ('BACKGROUND', (0,-1), (-1,-1), FBCA_LIGHT),
    ('TEXTCOLOR', (2,-3), (2,-3), colors.HexColor('#cc6600')),
    ('ROWBACKGROUNDS', (0,1), (-1,-2), [colors.white, FBCA_LIGHT]),
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cccccc')),
    ('ALIGN', (2,0), (-1,-1), 'CENTER'),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
]))
story.append(adult_table)

story.append(Spacer(1, 0.1*inch))
story.append(Paragraph("⚠️ Note: Caffey/O'Neal/Payne class attendance was not recorded in PCO for March 1. Please follow up with the class leader.", note_style))
story.append(Spacer(1, 0.2*inch))

# Footer
story.append(HRFlowable(width="100%", thickness=1, color=ACCENT))
story.append(Spacer(1, 0.08*inch))
footer_style = ParagraphStyle('Footer', parent=styles['Normal'],
    fontSize=8, textColor=colors.HexColor('#999999'), alignment=TA_CENTER)
story.append(Paragraph("Generated by B.O.B. 🦦  •  First Baptist Church Arlington  •  Data source: Planning Center Online", footer_style))

doc.build(story)
print(f"PDF saved to: {OUTPUT}")
