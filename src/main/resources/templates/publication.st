publication(id,title,authors,type,venue,year,acceptance,note,abstract,pubmed) ::= <<

	<tr class="content">
		<td class="leftColumn">$type$</td>
		<td class="rightColumn">
		<a href="publication-$id$.html">
			<b>$title$</b>, <i>$venue$ $year$</i>. $if (!acceptance.empty)$ [$acceptance$ % acceptance rate] $endif$
			<br> 		
			$author(first(authors))$$rest(authors):{ author |, $author(author)$}$.
			$if (!note.empty)$ <span class="note">$note$</span>$endif$
		</a>		
		</td>
	</tr>

>>

