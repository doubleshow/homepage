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
	
//	static class Publication{
//		final private String title;
//		final private String type;
//		final private String year;
//		final private String acceptance;
//		final private String abstract;
//		
//	}
	
	//private static String docRoot = "src/main/resources/docs";
	private static String docRoot = "src/main/resources/pilyoung";
	
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

		List<String> sectionNames = Lists.newArrayList();
		for (File sectionFile : sectionFiles){
			String sectionName = sectionFile.getName().replace(".csv","");
			sectionNames.add(sectionName);//f.getName());
		}

		ST sectionMenu = g.getInstanceOf("subMenu").add("items",
				sectionNames);

		t.add("subMenu", sectionMenu);

		//g.getInstanceOf(name));


		List<ST> sections = Lists.newArrayList();
		for (File sectionFile : sectionFiles){
			String sectionName = sectionFile.getName().replace(".csv","");
						
			ST section = g.getInstanceOf("section").add("name", sectionName);
			
			//ST section = g.getInstanceOf("section").add("name", sectionName);

			List<ST> sectionItems = Lists.newArrayList();

			//String dataFilename = docRoot + "/" + pageName + "/" + sectionName + "/data.csv";
			String dataFilename = sectionFile.getCanonicalPath();
			//System.out.println("Reading " + dataFilename);
			System.out.println("Generating section: " + sectionName);//dataFilename);
			CsvReader dataCsvReader = new CsvReader(dataFilename);

			dataCsvReader.readHeaders();
			dataCsvReader.getHeaders();				
			
			String currentType = "";
			while (dataCsvReader.readRecord()){

				ST sectionItem = v.getInstanceOf(sectionName);
				
				String id = dataCsvReader.get("id");
				
				ST sectionItemDetail = v.getInstanceOf(sectionName + "-detail");
				if (sectionItemDetail != null){
					
					//ST detailPage = g.getInstanceOf("main");
					//detailPage.
					//g.get
					
					for (String header : dataCsvReader.getHeaders()){
						String value = dataCsvReader.get(header);
						
						if (header.equals("authors")){
							
							//String value = dataCsvReader.get(header);
							List<Author> authors = Lists.newArrayList();
							Iterable<String> authorStrings = Splitter.on(",").trimResults().split(value);
							for (String authorString : authorStrings){
								boolean isMe = authorString.equals("Pilyoung Kim");
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
						}
						
					}else if (header.equals("authors")){
						
						String value = dataCsvReader.get(header);
						List<Author> authors = Lists.newArrayList();
						Iterable<String> authorStrings = Splitter.on(",").trimResults().split(value);
						for (String authorString : authorStrings){
							boolean isMe = authorString.equals("Pilyoung Kim");
							authors.add(new Author(authorString, isMe));
						}
						
						sectionItem.add(header, authors);
						
					}else{
						//sectionItem.
						//System.out.println(sectionItem.getAttribute(header));
						sectionItem.add(header, dataCsvReader.get(header));
					}
				}

				sectionItems.add(sectionItem);

			}		
			dataCsvReader.close();


			section.add("items", sectionItems);

			sections.add(section);				
		}



		t.add("content", sections);

		String htmlString =  t.render();

		Files.write(htmlString, new File(htmlFilename), Charset.defaultCharset());
	}



	public static void main( String[] args ) throws IOException
	{

		//STGroupFile g = new STGroupFile("templates/default.stg", "utf-8", '$', '$');
		//STGroup g = new STGroupDir("templates",'$','$');
		
		//String name = "tomyeh";
		String myname = "pilyoung";
		
		
		//ST profile = d.getInstanceOf("tomyeh");
		ST profile = d.getInstanceOf(myname);
		
		List<String> rootPages = Lists.newArrayList("about","research","cv");		

		for (String pageName : rootPages){
			ST t = g.getInstanceOf("main");
			t.add("title", myname + ":"+pageName);
			t.add("profile", profile);

			boolean[] selections = new boolean[]{false,false,false};
			selections[rootPages.indexOf(pageName)] = true;

			ST topMenu = g.getInstanceOf("topMenu")
			.add("items", rootPages)
			.add("selections", selections);
			t.add("topMenu", topMenu);
			renderRootPage(pageName,t);
		}



		//System.out.prin
	}
}
