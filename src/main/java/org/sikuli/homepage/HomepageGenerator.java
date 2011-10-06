package org.sikuli.homepage;

import java.io.File;
import java.io.FileFilter;
import java.io.FilenameFilter;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.Iterator;
import java.util.List;

import org.stringtemplate.v4.ST;
import org.stringtemplate.v4.STGroup;
import org.stringtemplate.v4.STGroupDir;
import org.stringtemplate.v4.STGroupFile;

import com.csvreader.CsvReader;
import com.google.common.base.Splitter;
import com.google.common.collect.Lists;
import com.google.common.io.Files;

/**
 * Hello world!
 *
 */
public class HomepageGenerator 
{

	
	static class Author{
		public Author(String name, boolean me) {
			super();
			this.name = name;
			this.me = me;
		}
		final private String name;
		final private boolean me;
		public String getName() {
			return name;
		}
		public boolean isMe() {
			return me;
		}	
	}
	
	static class Section{
		final private String name;
		final private File dataFile;
		
		public Section(File dataFile){
			
			this.dataFile = dataFile;
			String dataFilename = dataFile.getName().replace(".csv","");			
			
			List<String> toks = Lists.newArrayList(Splitter.on('-').split(dataFilename));			
			if (toks.size() == 1){
				this.name = toks.get(0);
			}else if (toks.size() == 2){
				this.name = toks.get(1);
			}else
				this.name = null;
		}
		public String getName() {
			return name;
		}
		public File getDataFile(){
			return dataFile;
		}
	}
	
//	static class Publication{
//		final private String title;
//		final private String type;
//		final private String year;
//		final private String acceptance;
//		final private String abstract;
//		
//	}
	
	private static String name = "tomyeh";
	private static String docRoot = "src/main/resources/docs";
	
	//private static String docRoot = "src/main/resources/pilyoung";
	
	private static STGroupFile g = new STGroupFile("templates/default.stg", "utf-8", '$', '$');
	private static STGroupFile v = new STGroupFile("templates/views.stg", "utf-8", '$', '$');
	private static STGroup d = new STGroupDir("templates", "utf-8", '$', '$');

	private static void renderRootPage(String pageName, ST t) throws IOException{

		String htmlFilename = pageName + ".html";

		File dir = new File(docRoot,pageName);
		File[] sectionFiles = dir.listFiles(new FileFilter(){

			public boolean accept(File f) {
				return f.getName().endsWith("csv");
			}			
		});

		
		List<Section> sections = Lists.newArrayList();
		for (File sectionFile : sectionFiles){
			Section sectionObject = new Section(sectionFile);
			sections.add(sectionObject);//f.getName());
		}

		ST sectionMenu = g.getInstanceOf("sectionMenu").
		add("pageName",pageName).
		add("items",sections);

		t.add("subMenu", sectionMenu);

		//g.getInstanceOf(name));


		List<ST> sectionTemplates = Lists.newArrayList();
		for (Section sectionObject : sections){
			String sectionName = sectionObject.getName();
						
			ST sectionTemplate = g.getInstanceOf("section").add("name", sectionName);
			

			List<ST> sectionItems = Lists.newArrayList();

			System.out.println("Generating:" + pageName + "/" + sectionName);
			CsvReader dataCsvReader = new CsvReader(sectionObject.getDataFile().getAbsolutePath());

			dataCsvReader.readHeaders();
			dataCsvReader.getHeaders();				
			
			String currentType = "";
			while (dataCsvReader.readRecord()){

				ST sectionItem = v.getInstanceOf(sectionName);
				
				String id = dataCsvReader.get("id");
				
				ST sectionItemDetail = v.getInstanceOf(sectionName + "-detail");
				if (sectionItemDetail != null){
					
					for (String header : dataCsvReader.getHeaders()){
						String value = dataCsvReader.get(header);
						
						if (header.equals("authors")){
							
							//String value = dataCsvReader.get(header);
							List<Author> authors = Lists.newArrayList();
							Iterable<String> authorStrings = Splitter.on(";").trimResults().split(value);
							for (String authorString : authorStrings){
								boolean isMe = authorString.equals("Kim");
								authors.add(new Author(authorString, isMe));
							}
							
							sectionItemDetail.add(header, authors);
						}else{								
							sectionItemDetail.add(header, value);
						}
					}
					
					t.add("content",sectionItemDetail);//"some details");

//						if (header.equals("type")){
//							
//							String typeValue = dataCsvReader.get("type");
//							
//							if (!typeValue.equalsIgnoreCase(currentType)){
//								currentType = typeValue;
//								sectionItem.add(header, typeValue);
//							}
//							
//						}else if (header.equals("authors")){
//							
//							String value = dataCsvReader.get(header);
//							List<Author> authors = Lists.newArrayList();
//							Iterable<String> authorStrings = Splitter.on(",").trimResults().split(value);
//							for (String authorString : authorStrings){
//								boolean isMe = authorString.equals("Pilyoung Kim");
//								authors.add(new Author(authorString, isMe));
//							}
//							
//							sectionItem.add(header, authors);
//							
//						}else{
//							
//							sectionItem.add(header, dataCsvReader.get(header));
//						}
//					}
					
					String detailHTMLFilename = sectionName + "-" + id + ".html";
					String htmlString =  t.render();
					Files.write(htmlString, new File(detailHTMLFilename), Charset.defaultCharset());
					t.remove("content");
				}

				for (String header : dataCsvReader.getHeaders()){

					if (header.equals("type")){
						
						String typeValue = dataCsvReader.get("type");
						
						if (!typeValue.equalsIgnoreCase(currentType)){
							currentType = typeValue;
							sectionItem.add(header, typeValue);
						}else{
							sectionItem.add(header, "");							
						}
						
					}else if (header.equals("authors")){
						
						String value = dataCsvReader.get(header);
						List<Author> authors = Lists.newArrayList();
						Iterable<String> authorStrings = Splitter.on(",").trimResults().split(value);
						for (String authorString : authorStrings){
							boolean isMe = authorString.equals("Kim");
							authors.add(new Author(authorString, isMe));
						}
						
						sectionItem.add(header, authors);
						
					}else{

						sectionItem.add(header, dataCsvReader.get(header));
					}
				}

				sectionItems.add(sectionItem);

			}		
			dataCsvReader.close();


			sectionTemplate.add("items", sectionItems);

			sectionTemplates.add(sectionTemplate);				
		}



		t.add("content", sectionTemplates);

		String htmlString =  t.render();

		Files.write(htmlString, new File(htmlFilename), Charset.defaultCharset());
	}



	public static void main( String[] args ) throws IOException
	{

		
		//String myname = "tomyeh";
		//String myname = "pilyoung";
		
		
		//ST profile = d.getInstanceOf("tomyeh");
		ST profile = d.getInstanceOf(name);
		
		List<String> pageNames = Lists.newArrayList("about","research","cv");		

		for (String pageName : pageNames){
			ST t = g.getInstanceOf("main");
			t.add("title", name + ":"+pageName);
			t.add("profile", profile);

			boolean[] selections = new boolean[]{false,false,false};
			selections[pageNames.indexOf(pageName)] = true;

			ST topMenu = g.getInstanceOf("topMenu")
			.add("items", pageNames)
			.add("selections", selections);
			t.add("topMenu", topMenu);
			renderRootPage(pageName,t);
		}



		//System.out.prin
	}
}
