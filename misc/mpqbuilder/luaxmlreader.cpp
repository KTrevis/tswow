/*
 * This file is part of tswow (https://github.com/tswow)
 *
 * Copyright (C) 2020 tswow <https://github.com/tswow/>
 * This program is free software: you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
#include <boost/filesystem.hpp>
#include <boost/algorithm/string/predicate.hpp>
#include <StormLib.h>
#include <stdexcept>
#include <iostream>
#include <functional>
#include <algorithm>
#include <vector>
#include <set>

std::vector<std::string> special_files = {
	  "interface\\glues\\charactercreate\\ui-charactercreate-classes.blp"
	, "interface\\targetingframe\\ui-classes-circles.blp"
	, "interface\\worldstateframe\\icons-classes.blp"
	, "textures\\minimap\\md5translate.trs"
};

namespace fs = boost::filesystem;

fs::path findClientLang(fs::path directory) {
    static std::set<std::string> localeIDs = {
		"enUS", "enGB", "deDE", "frFR", "esES", "esMX",
		"ruRU", "koKR", "zhCN", "zhTW", "ptBR", "itIT",
		"enCN", "enTW", "ptPT"
	};
	fs::directory_iterator end;
	for(fs::directory_iterator itr(directory); itr != end; ++itr)
	{
		if(fs::is_directory(itr->path()) && localeIDs.find(itr->path().filename().string()) != localeIDs.end())
		{
			return itr->path();
		}
	}
	throw std::runtime_error("No lang directory found in "+directory.string());
}

void handleFile(
	  HANDLE hMpq
	, std::string const& file
	, std::string const& outputDir
	, std::string const& iconOutputDir
) {
	std::string fileLower = file;
	std::transform(fileLower.begin(), fileLower.end(), fileLower.begin(),
		[](unsigned char c){ return std::tolower(c); });

	const bool isSpellIcon =
		   boost::algorithm::starts_with(fileLower, "interface\\icons\\")
		&& boost::algorithm::ends_with(fileLower, ".blp");

	if(
		   boost::algorithm::ends_with(fileLower,".xml")
		|| boost::algorithm::ends_with(fileLower,".lua")
		|| boost::algorithm::ends_with(fileLower,".toc")
		|| isSpellIcon
		|| std::find(special_files.begin(),special_files.end(),fileLower) != special_files.end())
	{
		auto f = isSpellIcon ? fileLower : file;
		std::replace(f.begin(),f.end(),'\\','/');
		fs::path outfile = (isSpellIcon ? iconOutputDir : outputDir) / fs::path(f);
		fs::create_directories(outfile.parent_path());
		SFileExtractFile(hMpq,file.c_str(),outfile.string().c_str(),0);
	}
}

int main(int argc, char **argv) {
	if (argc < 3) {
		std::cout << "Usage: luaxmlreader outputDir clientPath [iconOutputDir]";
		return -1;
	}

	std::string outputDir = argv[1];
	std::string iconOutputDir = argc >= 4 ? argv[3] : outputDir;
	fs::path langdir = findClientLang(fs::path(argv[2]));
	fs::path mainfile;
	std::vector<fs::path> patches;

	// todo: hack for md5translate.trs, do this properly!
	fs::directory_iterator end;

	for(fs::directory_iterator itr(langdir); itr != end; ++itr)
	{
		if (itr->path().filename().string().find("locale-", 0) == 0) {
			mainfile = itr->path();
		}

		else if (itr->path().filename().string().find("patch") == 0) {
			auto fullstr = itr->path();
			if(!fs::is_directory(fullstr))
			{
				patches.push_back(fullstr);
			}
		}
	}

	std::sort(patches.begin(), patches.end(), [](fs::path const& a, fs::path const& b) {
		if (b.string().length() != a.string().length()) return b.string().length() > a.string().length();
		return b.string() > a.string();
	});

	// md5translate.trs hack
	patches.push_back(fs::path(argv[2]) / "patch-3.MPQ");

	HANDLE mpq = NULL;
	if (!SFileOpenArchive(mainfile.string().c_str(), 0, STREAM_FLAG_READ_ONLY, &mpq)) {
		std::cout << "Failed to open main MPQ file " << mainfile.string() << " with error " << GetLastError() << "\n";
		return GetLastError();
	}

	for (auto& patch : patches) {
		if (!SFileOpenPatchArchive(mpq, patch.string().c_str(), NULL, 0)) {
			std::cout << "Failed to apply patch " << patch << " with error " << GetLastError() << "\n";
			return GetLastError();
		}
	}

	SFILE_FIND_DATA fileData;
	HANDLE findHandle = SFileFindFirstFile(mpq, "*", &fileData, 0);
	if (findHandle != NULL) {
		do {
			handleFile(mpq, std::string(fileData.cFileName), outputDir, iconOutputDir);
		} while (SFileFindNextFile(findHandle, &fileData));
		SFileFindClose(findHandle);
	}

	SFileCloseArchive(mpq);
	return 0;
}
