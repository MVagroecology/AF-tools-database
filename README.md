# Agroforestry Tools (and soon Data) Database
## Moving from Scattered to Converging Ecosystem

Created within the [DigitAF](https://digitaf.eu/) project, this online agroforestry tools database **aims at filling a gap in the agroforestry arena, bringing gathered tools in one place to ease their access within a contextual frame**. This preliminary version (still under development) is currently available at https://digitaf.eu/tools-database/. Ultimately, this will help increase knowledge about **which tools exist**, **how they can be made compatible with each other**, and **which topics have a tool-gap** (and therefore the potential to develop new tools).

The general intention is that any user may contribute with new tools to the database, edit any incomplete or outdated information about any of the tools, and that the interaction with the database and results display should be easy and comprehensible. Available filters allow users to search for tools depending on different criteria, depending on the user needs. A quick FAIRness score is available for each tool to enable an assessment preview of the easiness of their findability, accessibility, interoperability and reusability.

## How to contribute with new tools?
### Answering a Google Form

A very common way of **collecting information** is through a **questionnaire**, and the Google Forms platform is free and easy to use. It **is available at https://forms.gle/cKwFUzGuckhfSHum6** and should be used to add a new tool that might be useful. There are seven sections of questions, many of them multiple choice. They are divided into general questions about the tool, some about more technical details, about its use, accessibility, and documentation. It takes about 10-15 minutes to complete. The only personal information collected is the user email to ask any follow-up questions that may arise.

### The Geek Way

Tools can be added or edited directly in this GitHub repository (curated by [EURAF](https://euraf.net/)).

In detail, consider that the `/tools` folder includes:
- `tools_form.json` file, that holds every question whose answers represent the tool's respective data, which is then displayed and filtered;
- `tools_list.json` file, that contains the list of every reviewed tool;
- `tools_template.json` file, that contains the list of every reviewed tool;
- an individual `.json` file for each one of the tools.

Using common methods of Git:
1. Fork the repository;
2. Do your edits;
	- If adding a new tool:
		- Create a new file with your tool's name (using a simple string, avoiding illegal characters, symbols or spaces);
		- Copy the `tools_template.json` content and past it into the new file;
		- Fill in the needed fields, based on the indications given in the `tools_form.json`.
	- If editing an existing tool:
		- Open the tool's respective `.json` file;
		- Edit the needed fields, based on the indications given in the `tools_form.json`;
3. Commit your edits;
4. Create a pull request;
5. Wait for the team of curators to verify, request changes if necessary, and then merge your edits/tool which will become live in the online tool database.

## Acknowledgements

This database was developed within the [DigitAF](https://digitaf.eu/) project. The DigitAF project has received funding from the European Union’s Horizon Europe research and innovation programme under Grant Agreement n.° 101059794.