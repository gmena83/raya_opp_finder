Project: Rayapower AI Grant WorkflowGoal: Automate the analysis, context gathering, and pre-filling of financing applications for renewable energy startups.Primary Stack: n8n (Orchestration), Apify (Scraping), OpenAI/Claude (Intelligence), Google Workspace (Interface/Storage).
1. The Tech Stack & ToolsComponentToolPurposeOrchestratorn8n (Cloud or Self-Hosted)The central "brain" connecting all apps. Handles logic, loops, and agent delegation.Web ScraperApifySpecifically the Website Content Crawler or Universal Web Scraper Actors. Needed to bypass CAPTCHAs and render dynamic JS forms (Typeform, etc.).LLM (Reasoning)Anthropic Claude 3.5 SonnetPrimary Recommendation. Superior at reading long documents (PDF rules) and following complex formatting instructions without "hallucinating."LLM (Search)Perplexity API or Serper.devUsed by n8n to perform "live" web searches for past winners and news.Knowledge BasePinecone (via n8n)A vector database to store the "Company Brain." It remembers company history, past successful answers, and tone.InterfaceGoogle SheetsInput (User pastes URL) and Output (AI pastes questions & draft answers).StorageGoogle DriveStores the downloaded PDFs, Rules, and raw Markdown files.
2. Google Drive & Data StructureBefore building, create this exact folder hierarchy to keep the AI organized:Plaintext/Rayapower_Grant_Bot
    ├── /01_Inputs (Monitor this for new URLs if using a file trigger, or just use Sheet)
    ├── /02_Active_Applications
    │     ├── [Date]_[Opportunity_Name]
    │     │     ├── Context_Rules (PDFs found)
    │     │     ├── Raw_Form_Data.md
    │     │     └── Application_Draft.gsheet
    └── /03_Knowledge_Base
          ├── /Company_Docs (Pitch decks, financial summaries)
          └── /Completed_Applications (AI reads this folder to "Learn")
The Master Google Sheet Structure:Create a sheet with these columns for the Input/Output flow:Column A: Opportunity URLColumn B: Status (Pending -> Processing -> Done)Column C: Opportunity Name (AI detected)Column D: Link to Generated Workspace (Drive Folder Link)Column E: Link to Drafted Answers (Sheet Link)3. 

# Workflow Architecture
This system consists of two separate n8n workflows to avoid complexity.

a. Workflow A: The "Application Generator" (The Main Loop)Trigger: Row added to Google Sheet (Column A).
Step 1: The Scout (Scraping)n8n sends URL to Apify.Apify renders the page.Action: Extracts all text (HTML to Markdown).Action: Identifies downloadable links (.pdf, .docx) ending in keywords like "bases", "rules", "decree".n8n downloads these files and uploads them to /02_Active_Applications/[Name]/Context_Rules.
Step 2: The Researcher (External Context)n8n (using Perplexity/Serper) performs 3 searches:"[Opportunity Name] past winners renewable energy""[Opportunity Name] evaluation criteria and priorities""[Opportunity Name] news and press release"Summarizes results into a text block: External_Context_Summary.
Step 3: The Analyst (Context Retrieval - RAG)n8n converts the scraped Form Questions into a list.Vector Store Lookup (Pinecone): For each major question (e.g., "Describe your innovation"), the AI searches the Knowledge Base for relevant chunks from previous winning applications.Output: A packet of info containing: {Current_Rules} + {External_Context} + {Company_Knowledge}.
Step 4: The Writer (Drafting)LLM Node (Claude 3.5): Takes the packet from Step 3.Prompt: "Act as a Grant Writer for Rayapower. Using the context provided, answer the specific question: '[Question]'. Adhere strictly to the character limit found in the rules."Google Sheets: Updates a new spreadsheet with Question | Drafted Answer | Source Material.

b) Workflow B: The "Learning Loop" (The Feedback Mechanism)Trigger: New file uploaded to /03_Knowledge_Base/Completed_Applications.
File Parser: n8n reads the PDF/Doc/Sheet.
Chunking: Splits the text into small semantic chunks (e.g., "Team Description", "Financial Projections").
Embedding: Uses OpenAI text-embedding-3-small to turn text into numbers.
Upsert: Saves these vectors into Pinecone.
Result: The next time Workflow A runs, it now "knows" this information.

4. High-Level Logic & Prompts
A. The "Form Parser" Prompt (for scraping)Used after Apify scrapes the raw HTML.Role: You are a Data Extractor.Input: Raw Markdown of a website.Task: Identify the application questions.Look for input fields, question text, or list items that require a user response.Ignore navigation menus, footers, and general marketing copy.Output Format: JSON Array only. [{"question_id": 1, "question_text": "...", "character_limit": "..."}]
B. The "Grant Writer" Prompt (The Core Brain)Used in the final drafting step.Role: Senior Grant Writer for Rayapower (Renewable Energy Startup).Tone: Professional, persuasive, data-driven.Context Provided:The Rulebook: (Attached PDF text) - Follow these constraints strictly.Company Knowledge: (Retrieved from Database) - Use these facts.Web Research: (Past winners) - Align our value proposition with these trends.The Question: "{{Current_Question}}"Task: Draft a response.Start directly with the answer (no fluff).Cite which document you used for the logic in brackets, e.g., [Rules Pg 4].If the Knowledge Base lacks specific data (e.g., "Current revenue for 2025"), write: "[[MISSING DATA: Please fill manually]]".

5. Implementation Roadmap (Step-by-Step Guide)Use this order to build without getting overwhelmed:Phase 1: The Skeleton.Set up the Google Sheet Trigger in n8n.Connect Apify and make it successfully scrape one URL and return text.Goal: You paste a URL, and n8n returns the raw text in the debug window.Phase 2: File Management.Add the Google Drive node.Make n8n create the folders and save the scraped text as a .md file.Phase 3: The Brain (RAG).Set up Pinecone (free tier is fine for starting).Build "Workflow B" (The Learning Loop) first. Upload one company document so the brain isn't empty.Phase 4: The Writer.Connect the LLM node.Feed it the Scraped Text + Pinecone Context.Map the output back to Google Sheets.