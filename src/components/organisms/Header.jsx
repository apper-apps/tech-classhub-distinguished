import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import UserProfile from "@/components/molecules/UserProfile";
import LogoutButton from "@/components/atoms/LogoutButton";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
const Header = ({ onMobileMenuToggle }) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            icon="Menu"
            onClick={onMobileMenuToggle}
            className="lg:hidden"
          />
          
          {/* Search */}
          <div className="hidden sm:block w-80">
            <SearchBar
              placeholder="Search students, grades, assignments..."
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={(query) => {
                console.log("Searching for:", query);
              }}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <ApperIcon name="Bell" className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </Button>
          
{/* User Profile */}
          <div className="flex items-center space-x-3">
            <UserProfile />
            <LogoutButton />
</div>
        </div>
      </div>
      {/* Mobile Search */}
      <div className="sm:hidden mt-4">
        <SearchBar
          placeholder="Search..."
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={(query) => {
            console.log("Searching for:", query);
          }}
        />
      </div>
    </header>
  );
};

export default Header;