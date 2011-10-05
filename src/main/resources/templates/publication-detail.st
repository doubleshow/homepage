publication-detail(id,title,authors,type,venue,year,acceptance,note,abstract,pubmed) ::= <<


	<tr class="content">
		<td class="leftColumn">
		</td>
		<td class="rightColumn">
			<span class="title">$title$</span><br>
			$first(authors).name$$rest(authors):{ author |, $author.name$}$<br>
		</td>
	</tr>
	<tr class="content">
		<td class="leftColumn"></td>
		<td class="rightColumn">
			<i>$venue$</i>
		</td>
	</tr>
	<tr class="content">
		<td class="leftColumn">Abstract</td>
		<td class="rightColumn">
			$abstract$		
		</td>
	</tr>
	
	<tr class="content">
		<td class="leftColumn">PubMed</td>
		<td class="rightColumn">
			<a href=$pubmed$>$pubmed$</a>		
		</td>
	</tr>

>>

